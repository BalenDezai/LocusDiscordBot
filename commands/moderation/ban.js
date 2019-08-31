const Command = require('../../models/Command');
const Utils = require('../../modules/Utils');

class Ban extends Command {
  constructor(client) {
    super(client, {
      name: 'ban',
      description: 'Bans a mentioned user or users, plus you can specify the amount of days of messages to remove',
      category: 'Moderation',
      usage: ['ban [user mention/s]', ['ban [user mention/s] -d [days] -r [reason]']],
      guildOnly: true,
      permLevel: 'Moderator',
    });
  }

  async run(message, args) {
    //  find the indexes for arguements
    const indexOfD = args.indexOf('-d');
    const indexOfR = args.indexOf('-r');
    //  parse the day arguement
    const days = parseInt(args.slice(indexOfD + 1, indexOfR), 10);
    //  seperate the reason into a whole string
    const reason = args.slice(indexOfR + 1).join(' ');

    const bannedUsersTags = [];

    //  for each mentioned user, ban the user, inserting the days and reason
    if (message.mentions.users.size > 0) {
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
            message.channel.send(Utils.createErrorMessage(`Failed to ban user: **${user.tag}**`));
            this.client.logger.error(error);
          }
        }
      });

      message.channel.send(Utils.createSuccessMessage(`Successfully banned user(s) ${bannedUsersTags.join(' ')}`));
    } else {
      message.channel.send(Utils.createErrorMessage('You didn\'t mention any users to ban'));
    }
  }
}

module.exports = Ban;
