const discordApiError = require('discord.js').DiscordAPIError;
const Command = require('../../models/Command');
const Utils = require('../../modules/Utils');


class Kick extends Command {
  constructor(client) {
    super(client, {
      name: 'kick',
      description: 'kicks a mentioned user',
      category: 'Moderation',
      usage: ['kick [user mention/s]', 'kick [user mention/s] -r [reason]'],
      guildOnly: true,
      permLevel: 'Moderator',
    });
  }

  async run(message, args) {
    const indexOfR = args.indexOf('-r');
    let reason = '';
    let displaySuccess;

    if (indexOfR !== -1) {
      reason = args.slice(indexOfR + 1).join(' ');
    }

    const kickedUsersTags = [];

    if (message.mentions.users.size > 0) {
      message.mentions.users.forEach((user) => {
        const member = message.guild.member(user);
        if (member) {
          member.kick(reason)
            .then(() => kickedUsersTags.push(user.tag))
            .catch((e) => {
              if (e instanceof discordApiError) {
                message.channel.send(Utils.createErrorMessage(e.message));
              } else {
                message.channel.send(Utils.createErrorMessage(`Failed to kick user: **${user.tag}**`));
              }
              displaySuccess = false;
              this.client.logger.error(e);
            });
        } else {
          message.channel.send(Utils.createErrorMessage(`The user ${user.tag} is not in this guild`));
        }
      });
      if (displaySuccess === true) {
        message.channel.send(Utils.createSuccessMessage(`Successfully kicked user(s) ${kickedUsersTags.join(' ')}`));
      }
    } else {
      message.channel.send(Utils.createErrorMessage('You didn\'t mention any users to kick'));
    }
  }
}

module.exports = Kick;
