class GuildMemberAdd {
  constructor(client) {
    this.client = client;
  }

  async run(guildMember) {
    const settings = this.client.getSettings(guildMember.guild.id);
    const channelToMessage = guildMember.guild.channels.find(channel => channel.name === settings.welcomeChannel);
    console.log(settings);
    if (settings.welcomeEnabled === true) {
      try {
        channelToMessage.send(settings.welcomeMessage);
      } catch (error) {
        this.client.logger.error(error);
      }
    }
  }
}

module.exports = GuildMemberAdd;
