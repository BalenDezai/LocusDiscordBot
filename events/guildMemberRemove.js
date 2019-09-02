class GuildMemberRemove {
  constructor(client) {
    this.client = client;
  }

  async run(guildMember) {
    const settings = this.client.getSettings(guildMember.guild.id);
    console.log(settings);
    if (settings.byeEnabled === 'true') {
      const channelToMessage = guildMember.guild.channels.find(channel => channel.name === settings.byeChannel);
      const mentioned = settings.byeMessage.indexOf('{user}');
      let msg;

      if (mentioned > -1) {
        msg = settings.byeMessage.replace('{{user}}', guildMember);
      }
      try {
        channelToMessage.send(msg);
      } catch (err) {
        this.client.logger.error(err);
      }
    }
  }
}

module.exports = GuildMemberRemove;
