class message {
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
    //const messageArgs = message.content.slice(guildSettings.prefix.length).trim().split(/ +/g);
    const messageArgs = message.content.substring(guildSettings.prefix.length).trim().split(' ');
    const commandText = messageArgs.shift().toLowerCase();

    // Prevent caching errors by fetching the member if for any reason they should be invisible or not cached
    if (message.guild && !message.member) await message.guild.fetchMember(message.author);

    // Get the member's permission level
    const lvl = this.client.permLevel(message);

    // Grab the command from the Collection we set earlier
    const command = this.client.commands.get(commandText) || this.client.commands.get(this.client.aliases.get(commandText));
    if (!command) return;

    if (!message.guild && command.conf.guildOnly) {
      return message.channel.send('Sorry, this command is unavailable to use in DMs.');
    }

    if (lvl < this.client.levelCache[command.conf.permLevel]) {
      if (guildSettings.systemNotice) {
        return message.channel.send(`:octagonal_sign: | You do not have enough permissions to use this command.`);
      } else {
        return;
      }
    }

    message.author.permLevel = lvl;
    // message.flags = [];
    
    // while(messageArgs[0] && messageArgs[0][0]) {
    //   message.flags.push(messageArgs.shift().slice(1));
    // }

    // Finally we run the command
    this.client.logger.command(`${message.author.tag} (ID:${message.author.id}) is trying to run command ${command.help.name}`);
    command.run(message, messageArgs, lvl);
  }
}

module.exports = message;
