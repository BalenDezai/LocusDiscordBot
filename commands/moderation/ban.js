const Command = require('../../models/Command');

class Ban extends Command {
  constructor(client) {
    super(client, {
      name: 'ban',
      description: 'bans mentioned userr',
      category: 'Moderation',
      usage: ['ban [user mention] -d [days] -r [reason]', ['ban [user mention] [user mention]']],
    });
  }

  async run(message, args) {
    const indexOfD = args.indexOf('-d');
    const indexOfR = args.indexOf('-r');
    const days = parseInt(args.slice(indexOfD + 1, indexOfR), 10);
    const reason = args.slice(indexOfR + 1).join(' ');
    const bannedUsersTags = [];
    message.mentions.users.forEach((user) => {
      const member = message.guild.member(user);
      if (member) {
        try {
          member.ban({
            reason,
            days,
          });
          bannedUsersTags.push(user.tag);
        } catch (error) {
          message.channel.send(`failed to ban user ${user.tag}`);
          this.client.logger.error(error);
        }
      }
    });
    message.channel.send(`successfully banned user(s) ${bannedUsersTags.join(' ')}`);
  }
}

module.exports = Ban;
