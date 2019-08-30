const Command = require('../../models/Command');

class Avatar extends Command {
  constructor(client) {
    super(client, {
      name: 'avatar',
      description: 'displays mentioned users avatar',
      category: 'Basic',
      usage: 'avatar',
      aliases: ['av'],
    });
    this.run = async (message, args) => {
      if (args.length === 0) {
        message.channel.send(message.author.avatarURL);
        return;
      }
      const memberId = args[0].substring(2, args[0].length - 1);
      const foundMember = message.guild.members.find(member => member.id === memberId);
      message.channel.send(foundMember.user.avatarURL);
    };
  }
}

module.exports = Avatar;
