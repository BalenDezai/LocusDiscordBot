const { RichEmbed } = require('discord.js');
const axios = require('axios');
const Command = require('../../models/Command');


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

      const ServerInfo = new RichEmbed()
        .setColor('#4287f5')
        .setDescription('Viewing server information')
        .addField('Name of the Server:', guild.name)
        .addField('Owner of Server:', guild.owner)
        .addField('Server creation Date:', guild.createdAt)
        .addField('Server Region:', guild.region)
        .addField('Members:', guild.memberCount);

      if (guild.iconURL) {
        const serverIconUrl = guild.iconURL.slice(0, -4);
        const res = await axios.head(serverIconUrl);
        const type = res.headers['content-type'];
        const serverIconType = type.slice(type.indexOf('/') + 1);
        console.log(serverIconUrl)
        console.log(serverIconType)
        ServerInfo.setThumbnail(`${serverIconUrl}.${serverIconType}`);
      }
      message.channel.send(ServerInfo);
    };
  }
}

module.exports = Server;
