const Command = require('../models/Command');
const Utils = require('../modules/Utils');

class Emote extends Command {
  constructor(client) {
    super(client, {
      name: 'emote',
      description: 'Add or Remove emotes on the server',
      category: 'Server',
      usage: 'Emote [add/remove] [name if add] [emote or emote url]',
      guildOnly: true,
      permLevel: 'Moderator',
      perms: ['MANAGE_EMOJIS'],
    });
    this.createUrl = (emoteHash) => {
      const discordUrl = 'https://cdn.discordapp.com/emojis/';
      const ext = '.png';
      return `${discordUrl}${emoteHash}${ext}`;
    }
    this.getEmoteHash = (emote) => {
      const indexOfColon = emote.lastIndexOf(':');
      const indexOfEnd = emote.indexOf('>');
      return emote.slice(indexOfColon + 1, indexOfEnd);
    };
    this.getName = (emote) => {
      const IndexOfFirstColon = emote.indexOf(':');
      const indexOfLastColon = emote.lastIndexOf(':');
      return emote.slice(IndexOfFirstColon + 1, indexOfLastColon);
    }
    this.createNameFromUrl = (url) => {
      const indexOfslash = url.lastIndexOf('/');
      const indexofext = url.lastIndexOf('.');
      url.slice(indexOfslash + 1, indexofext);
    }
    this.isLink = (nameOrUl) => {
      if (nameOrUl.indexOf('http') === -1) {
        return false;
      }
      return true;
    };
  }


  async run(message, [action, name, emote]) {
    switch (action.toLowerCase()) {
      case 'add': {
        let emoteName;
        if (!emote) {
          const isLink = this.isLink(name);
          if (isLink) {
            emoteName = this.createNameFromUrl(name);
            message.guild.createEmoji(name, emoteName);
          } else {
            const emoteHash = this.getEmoteHash(name);
            const emoteUrl = this.createUrl(emoteHash);
            emoteName = this.getName(name);
            message.guild.createEmoji(emoteUrl, emoteName);
          }
          message.channel.send(Utils.createSuccessMessage(`emote ${emoteName} added`));
        } else {
          console.log(this.getEmoteHash(emote));
        }
        break;
      }
      case 'remove': {
        break;
      }
      default: {
        message.channel.send(Utils.createErrorMessage(`${action} is not a valid action`))
      }
    }
  }
}

module.exports = Emote;
