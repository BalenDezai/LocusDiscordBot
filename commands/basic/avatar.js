const Command = require('../../models/Command');
const { createErrorMessage } = require('../../modules/Utils');

class Avatar extends Command {
  constructor(client) {
    super(client, {
      name: 'avatar',
      description: 'displays self or mentioned users avatar',
      category: 'Basic',
      usage: ['avatar', 'avatar [user mention]'],
      aliases: ['av'],
    });
    this.run = async (message) => {
      if (message.mentions.users.size === 0) {
        message.channel.send(message.author.avatarURL);
        return;
      }

      if (message.mentions.users.size > 1) {
        message.channel.send(createErrorMessage('Can only grab one persons icon'));
        return;
      }
      console.log(message.mentions.users);
      const mentionedUser = message.mentions.users.first();
      const foundMember = message.guild.member(mentionedUser);
      message.channel.send(foundMember.user.avatarURL);
    };
  }
}

module.exports = Avatar;
