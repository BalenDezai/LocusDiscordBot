const Command = require('../models/Command');
const Utils = require('../modules/Utils');

class Emote extends Command {
  constructor(client) {
    super(client, {
      name: 'emote',
      description: 'Add or Remove emotes on the server',
      category: 'Server',
      usage: 'emote [add/remove] [name if add] [emote or emote url]',
      guildOnly: true,
      permLevel: 'Moderator',
      perms: ['MANAGE_EMOJIS'],
    });
    this.createUrl = (emoteHash) => {
      const discordUrl = 'https://cdn.discordapp.com/emojis/';
      const ext = '.png';
      return `${discordUrl}${emoteHash}${ext}`;
    };
    this.getEmoteHash = (emote) => {
      const indexOfColon = emote.lastIndexOf(':');
      const indexOfEnd = emote.indexOf('>');
      return emote.slice(indexOfColon + 1, indexOfEnd);
    };
    this.getName = (emote) => {
      if (emote.indexOf('http') > -1) {
        const indexOfslash = emote.lastIndexOf('/');
        const indexofext = emote.lastIndexOf('.');
        return emote.slice(indexOfslash + 1, indexofext);
      }
      const IndexOfFirstColon = emote.indexOf(':');
      const indexOfLastColon = emote.lastIndexOf(':');
      return emote.slice(IndexOfFirstColon + 1, indexOfLastColon);
    };
  }


  async run(message, [action, name, emote]) {
    switch (action.toLowerCase()) {
      case 'add': {
        if (!emote) {
          emote = name;
          name = this.getName(emote);
        }
        if (emote.indexOf('http') === -1) {
          console.log('here');
          const emoteHash = this.getEmoteHash(emote);
          emote = this.createUrl(emoteHash);
          console.log(emote);
        }
        message.guild.createEmoji(emote, name)
          .then(createdEmoji => message.channel.send(Utils.createSuccessMessage(`emote ${createdEmoji.name} added`)))
          .catch((err) => {
            this.client.logger.error(err);
            message.channel.send(Utils.createErrorMessage('Error adding the emote'));
          });
        break;
      }
      case 'remove': {
        const emoteToDelete = message.guild.emojis.find(emoji => emoji.id === this.getEmoteHash(name));
        if (!emoteToDelete) {
          message.channel.send(Utils.createErrorMessage('Emote does not exist in this guild'));
          return;
        }
        message.guild.deleteEmoji(emoteToDelete, emote)
          .then(() => message.channel.send(Utils.createSuccessMessage(`emote ${emoteToDelete.name} removed`)))
          .catch((err) => {
            this.client.logger.error(err);
            message.channel.send(Utils.createErrorMessage('Error removing the emote'));
          });
        break;
      }
      default: {
        message.channel.send(Utils.createErrorMessage(`${action} is not a valid action`));
      }
    }
  }
}

module.exports = Emote;
