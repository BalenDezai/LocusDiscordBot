const { RichEmbed } = require('discord.js');
const Command = require('../../models/Command');


class Ranking extends Command {
  constructor(client) {
    super(client, {
      name: 'ranking',
      description: 'displays current guild xp leaderboard',
      category: 'basic',
      usage: ['ranking'],
    });
  }

  async run(message) {
    const top = this.client.sql.prepare('SELECt * FROM scores WHERE guild = ? ORDER BY points DESC LIMIT 10;')
      .all(message.guild.id);
    const messageToReturn = new RichEmbed()
      .setTitle('Top Ten Leaderboard')
      .setAuthor(this.client.user.username, this.client.user.avatarURL)
      .setColor(0x00AE86);

    top.forEach((data) => {
      messageToReturn.addField(this.client.users.get(data.user).tag, `${data.points} points (level ${data.level})`);
    });
    message.channel.send(messageToReturn);
  }
}

module.exports = Ranking;
