const Command = require('../../models/Command');
const { createErrorMessage, createSuccessMessage } = require('../../modules/Utils');

// does not work well, removes reactions asynchronously
// and connection times outs after a while
class RemoveReactions extends Command {
  constructor(client) {
    super(client, {
      name: 'removereactions',
      description: 'removes reactions on messages in a channel',
      usage: ['removereactions [channel name] [limit]', 'rrs [channel name] [limit]'],
      guildOnly: true,
      permLevel: 'Administrator',
      aliases: ['rss'],
    });
    this.run = async (msg, args) => {
      if (args.length > 2) {
        msg.channel.send(createErrorMessage('insert error here'));
      }
      let chId = args[0];
      chId = chId.substring(chId.indexOf('#') + 1, chId.indexOf('>'));
      const ch = msg.guild.channels.get(chId);
      const fetchedMsgs = await ch.fetchMessages({ limit: args[1] });
      fetchedMsgs.forEach((message) => {
        message.reactions.forEach((reaction) => {
          reaction.fetchUsers()
            .then((users) => {
              users.forEach((user) => {
                if (!msg.guild.member(user)) {
                  reaction.remove(user);
                }
              });
            })
            .catch(err => console.log(err));
        });
      });
      msg.channel.send(createSuccessMessage('Successfully removed all reactions from guild members who have left'));
    };
  }
}

module.exports = RemoveReactions;
