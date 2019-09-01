const Command = require('../../models/Command');

class Server extends Command {
  constructor(client) {
    super(client, {
      name: 'server',
      description: 'Shows server information',
      category: 'Basic',
      usage: ['server'],
      guildOnly: true,
      permLevel: 'Member',
    });
  }
  async run(message) {
    console.log(message);
  }
}

module.exports = Server;
