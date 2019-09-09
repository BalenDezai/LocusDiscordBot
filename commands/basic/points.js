const Command = require('../../models/Command');
const { createErrorMessage } = require('../../modules/Utils');

class Points extends Command {
  constructor(client) {
    super(client, {
      name: 'points',
      description: 'displays self or mentioned users points',
      category: 'basic',
      usage: ['points', 'points [user mention]'],
      aliases: ['pt'],
    });
  }

  async run(message) {
    if (message.mentions.users.size > 1) {
      message.channel.send(createErrorMessage('Can only retrieve one persons points'));
      return;
    }

    let userScore;
    if (message.mentions.users.size === 0) {
      userScore = this.client.getPointScore.get(message.author.id, message.guild.id);
    } else {
      const mentionedUser = message.mentions.users.first();
      userScore = this.client.getPointScore.get(mentionedUser.id, message.guild.id);
    }

    message.channel.send(`Current points: ${userScore.points} Current level: ${userScore.level}`);
  }
}

module.exports = Points;
