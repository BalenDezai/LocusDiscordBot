class Guildcreate {
  constructor(client) {
    this.client = client;
  }

  async run(guild) {
    console.log('test');
    console.log(guild);
    console.log(this.client);
    const settings = this.client.getSettings(guild.id);
    // try {
    // } catch (error) {
    //   this.client.logger.error(error);
    // }
    const channel = this.client.channels.find(settings.welcomeChannel);
    channel.send(settings.welcomeMessage);
  }
}

module.exports = Guildcreate;
