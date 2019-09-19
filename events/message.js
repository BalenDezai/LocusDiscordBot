const Utils = require('../modules/Utils');

class Message {
  constructor(client) {
    this.client = client;
  }

  async run(message) {
    // Ignore messages from other bots
    if (message.author.bot) return;

    // TODO: perhaps refactor?
    const twoMinutes = 1000 * 60 * 2;
    // point scoring logic
    let score;
    if (message.guild) {
      //  get current user score if the message is in a guild
      score = this.client.getPointScore.get(message.author.id, message.guild.id);

      if (!score) {
        //  if user is new (not tracked by bot), create new scorekeeping
        score = {
          id: `${message.guild.id}-${message.author.id}`,
          user: message.author.id,
          guild: message.guild.id,
          points: 0,
          level: 0,
          lastXp: new Date().getTime() - twoMinutes,
        };
      }
      //  if 2 minutes has elapsed
      if (new Date().getTime() - score.lastXp > twoMinutes) {
        // give a random xp between 0 and 5
        score.points += Utils.randomNumber(1, 5);

        const currentLevel = Math.floor(0.1 + Math.sqrt(score.points));
        if (score.level < currentLevel) {
        //  TODO: needs to be changed
          score.level += 1;
          message.reply(`Congratulations you leveled up to level: ${currentLevel}`)
            .catch(err => this.client.logger.error(err.message));
        }
        this.client.logger.log('point given');
        // save new point score
        score.lastXp = new Date().getTime();
        this.client.setPointScore.run(score);
      }
    }


    // If the bot has no permission to send messages, ignore the processing
    if (message.guild && !message.channel.permissionsFor(message.guild.me).missing('SEND_MESSAGES')) {
      return;
    }

    // Fetch guild settings, then attach to message object
    const guildSettings = this.client.getSettings(message.guild.id);
    message.settings = guildSettings;

    // Check if the bot was mentioned
    const mentionMatch = new RegExp(`^<@!?${this.client.user.id}>( |)$`);

    // If so, inform the user about the current prefix
    if (message.content.match(mentionMatch)) {
      return message.channel.send(Utils.createInfoMessage(`Current prefix for this guild is: **${guildSettings.prefix}**`))
        .then((botMessage) => {
        // Delete the message sent by the bot after 10000ms (10 seconds)
          botMessage.delete(10000);
        })
        .catch((error) => {
          console.error(error);
        });
    }

    // Ignore messages that don't start with the set prefix
    if (message.content.indexOf(guildSettings.prefix) !== 0) return;

    // Begin command processing
    const messageArgs = message.content.substring(guildSettings.prefix.length).trim().split(' ');
    const commandText = messageArgs.shift().toLowerCase();

    // Prevent caching errors by fetching the member if for any reason they should be invisible or not cached
    if (message.guild && !message.member) await message.guild.fetchMember(message.author);

    // Grab the command from the Collection we set earlier
    const command = this.client.commands.get(commandText) || this.client.commands.get(this.client.aliases.get(commandText));
    if (!command) return;

    // Warn the user that the command is guild only
    if (!message.guild && command.conf.guildOnly) {
      return message.channel.send(Utils.createErrorMessage('Sorry, this command is unavailable to use in DMs.'));
    }

    // Prevent the command from running if the user doesn't have enough permission
    // Get the member's permission level
    const lvlObject = this.client.permLevel(message);

    // First we check to see if the level set in the command actually exists
    if (typeof (this.client.levelCache[command.conf.permLevel]) !== 'number') {
      return message.channel.send(Utils.createErrorMessage('The command you\'re trying to run is improperly configured.'));
    }

    // Retrieve role specific user perms
    const userPerms = message.member.permissions.toArray();

    // Then we check that the user's own permission level is higher than the MINIMUM required by
    // the command
    if (lvlObject.lvl < this.client.levelCache[command.conf.permLevel]) {
      // check if the user has specific role permissions
      if (!Utils.hasPerms(userPerms, command.conf.perms)) {
        console.log(`PERM LEVEL: ${this.client.levelCache[command.conf.permLevel]}`);
        if (guildSettings.systemNotice) {
          return message.channel.send(Utils.createErrorMessage('You do not have enough permissions to use this command.'));
        }
        return;
      }
    }

    // Save the current user's permission level in the message.author object
    message.author.permLevel = lvlObject.lvl;

    // Finally we run the command
    this.client.logger.command(`${message.author.tag} (ID:${message.author.id}) is trying to run command ${command.help.name}`);
    command.run(message, messageArgs, lvlObject.lvl);
  }
}

module.exports = Message;
