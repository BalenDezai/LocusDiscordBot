const { RichEmbed } = require('discord.js');
const Command = require('../../models/Command');
const { VerificationLevelString } = require('../../modules/Utils');


class Server extends Command {
  constructor(client) {
    super(client, {
      name: 'server',
      description: 'Shows server information',
      category: 'Basic',
      usage: ['server'],
      guildOnly: true,
      permLevel: 'Member',
    });
    this.run = (message) => {
      const { guild } = message;
      const author = guild.member(message.author);
      const txtChSize = guild.channels.filter(ch => ch.type === 'text').size;
      const vcChSize = guild.channels.filter(ch => ch.type === 'voice').size;
      const ServerInfo = new RichEmbed()
        .setColor('#4287f5')
        .setDescription(`Server Id: ${guild.id}\nServer Owner: ${guild.owner}`)
        .addField('Server Region:', guild.region, true)
        .addField('Members:', guild.memberCount, true)
        .addField('Verification Level:', VerificationLevelString(guild.verificationLevel), true)
        .addField('Channels:', `${guild.channels.size} (${txtChSize} text, ${vcChSize} voice)`, true)
        .addField('Server creation Date:', guild.createdAt.toUTCString())
        .addField('You joined at:', author.joinedAt.toUTCString());

      if (guild.iconURL) {
        const serverIconUrl = guild.iconURL.slice(0, -4);
        if (guild.features.includes('ANIMATED_ICON')) {
          ServerInfo.setAuthor(`${guild.name} (${guild.nameAcronym})`, `${serverIconUrl}.gif`);
          ServerInfo.setThumbnail(`${serverIconUrl}.gif`);
        } else {
          ServerInfo.setAuthor(`${guild.name} (${guild.nameAcronym})`, `${guild.iconURL}}`);
          ServerInfo.setThumbnail(guild.iconURL);
        }
      }
      message.channel.send(ServerInfo);
    };
  }
}

module.exports = Server;
