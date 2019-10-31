const Command = require('../../models/Command');

class Ping extends Command {
  constructor(client) {
    super(client, {
      name: 'ping',
      description: 'Check the current API response time and latency',
      category: 'Basic',
      usage: 'ping',
      aliases: ['latency', 'ms'],
    });
  }

  async run(message) {
    try {
      const pongMessage = await message.channel.send(':ping_pong: | Ping!');
      pongMessage.edit(`:ping_pong: | Pong! (Latency: ${pongMessage.createdTimestamp - message.createdTimestamp}ms) (Ping: ${Math.round(this.client.ping)}ms)`);
    } catch (error) {
      this.client.logger.error(error);
    }
  }
}

module.exports = Ping;
