const { RichEmbed } = require('discord.js');
const axios = require('axios');
const Command = require('../../models/Command');
const  { VerificationLevelString } = require('../../modules/Utils');


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
    this.run = async (message) => {
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
        const res = await axios.head(serverIconUrl);
        const type = res.headers['content-type'];
        const serverIconType = type.slice(type.indexOf('/') + 1);
        ServerInfo.setAuthor(`${guild.name} (${guild.nameAcronym})`, `${serverIconUrl}.${serverIconType}`);
        ServerInfo.setThumbnail(`${serverIconUrl}.${serverIconType}`);
      }
      message.channel.send(ServerInfo);
    };
  }
}

module.exports = Server;
