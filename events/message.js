const Utils = require('../modules/Utils');

class Message {
  constructor(client) {
    this.client = client;
  }

  async run(message) {
    // Ignore messages from other bots
    if (message.author.bot) return;

    // If the bot has no permission to send messages, ignore the processing
    if (message.guild && !message.channel.permissionsFor(message.guild.me).missing('SEND_MESSAGES')) {
      return;
    }

    // Fetch guild settings, then attach to message object
    const guildSettings = this.client.getSettings(message.guild.id);
    message.settings = guildSettings;

    // Check if the bot was mentioned
    const mentionMatch = new RegExp(`^<@!?${this.client.user.id}>( |)$`);
    if (message.content.match(mentionMatch)) {
      return message.reply(`Current prefix for this guild is: **${guildSettings.prefix}**`);
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
    if (!this.client.levelCache[command.conf.permLevel]) {
      return message.channel.send(Utils.createErrorMessage('The command you\'re trying to run is improperly configured.'));
    }

    // Then we check that the user's own permission level is higher than the MINIMUM required by
    // the command
    if (lvlObject.lvl < this.client.levelCache[command.conf.permLevel]) {
      console.log(`PERM LEVEL: ${this.client.levelCache[command.conf.permLevel]}`);
      if (guildSettings.systemNotice) {
        return message.channel.send(Utils.createErrorMessage('You do not have enough permissions to use this command.'));
      }
      return;
    }

    // Save the current user's permission level in the message.author object
    message.author.permLevel = lvlObject.lvl;

    // Finally we run the command
    this.client.logger.command(`${message.author.tag} (ID:${message.author.id}) is trying to run command ${command.help.name}`);
    command.run(message, messageArgs, lvlObject.lvl);
  }
}

module.exports = Message;
