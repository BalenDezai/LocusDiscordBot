import * as Discord from 'discord.js';
import { token } from './config.json';

require('dotenv').config();

const client = new Discord.Client();

client.once('ready', () => {
  console.log('Ready');
});

client.login(token);
