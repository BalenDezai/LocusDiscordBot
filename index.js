const Discord = require('discord.js');
const Config = require('./config.json');

require('dotenv').config();

const client = new Discord.Client();

client.once('ready', () => {
  console.log('Ready');
});

client.login(Config.token);
