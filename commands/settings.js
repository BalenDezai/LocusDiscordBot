const { RichEmbed } = require('discord.js');
const Utils = require('../modules/Utils');
const Command = require('../models/Command');

class Settings extends Command {
  constructor(client) {
    super(client, {
      name: 'settings',
      description: 'Update/change or check current server settings',
      category: 'System',
      usage: 'settings [get/set/reset] [key] [value]',
      guildOnly: true,
      aliases: ['set', 'settings'],
      permLevel: 'Administrator',
    });
  }

  async run(message, [action, key, ...value]) {
    const { settings } = message;

    // Check if the current guild is in the settings
    // If not, create an entry in the Enmap
    if (!this.client.settings.has(message.guild.id)) {
      this.client.settings.set(message.guild.id, {});
    }

    // Get the current overridden settings for the guild
    const overriddenSettings = this.client.settings.get(message.guild.id);

    switch (action) {
      case 'set':
      case 'edit': {
        // Check whether there is a key to change
        if (!key) {
          return message.channel.send(Utils.createErrorMessage('You must specify a key to edit'));
        }

        // Check whether the key name exists in the settings
        if (!(key in settings)) {
          return message.channel.send(Utils.createErrorMessage('The key you specified does not exist in the settings'));
        }

        // Now we check the value for the key we want to set
        if (value) {
          // Since the value is split into an array by default, join it so we can get
          // a string out of it to work with
          const valueString = value.join(' ');

          if (valueString.length < 1) {
            return message.channel.send(Utils.createErrorMessage('Please specify a value for the setting'));
          }

          // Check if the value is already in the settings
          if (valueString === settings[key]) {
            return message.channel.send(Utils.createErrorMessage('The setting you\'re trying to modify already has that value'));
          }

          this.client.settings.set(message.guild.id, valueString, key);
          message.channel.send(Utils.createSuccessMessage(`**${key}** has been successfully set to **${valueString}**`));
          break;
        }
        break;
      }

      case 'reset':
      case 'delete':
      case 'del': {
        // Check whether there is a key to reset
        if (!key) {
          return message.channel.send(Utils.createErrorMessage('You must specify a key to reset'));
        }

        // Check whether the key name exists in the settings
        if (!settings[key]) {
          return message.channel.send(Utils.createErrorMessage('The key you specified does not exist in the settings'));
        }

        // Check whether there's an override currently being used for the server
        if (!overriddenSettings[key]) {
          return message.channel.send(Utils.createErrorMessage(`The setting **${key}** is already set to default`));
        }

        // Create a new message to send to the user to await their response
        const yesResponses = ['y', 'yes', 'accept'];
        const noResponses = ['n', 'no', 'deny', 'reject'];

        const confirmationMessage = new RichEmbed()
          .setColor('#BC42F5')
          .setDescription(`:question: | Are you **sure** you want to reset ${key} to its default value?`)
          .setFooter('Respond with "yes" or "no"')
          .setTimestamp();

        const response = await this.client.awaitResponse(message, confirmationMessage, 30000);

        if (yesResponses.includes(response.toLowerCase())) {
          this.client.settings.delete(message.guild.id, key);
          return message.channel.send(Utils.createSuccessMessage(`**${key}** has been reset to the default value`));
        }
        if (noResponses.includes(response.toLowerCase())) {
          return message.channel.send(Utils.createSuccessMessage(`The value for **${key}** will remain as **${settings[key]}**`));
        }
        return message.channel.send(Utils.createErrorMessage('The command has timed out or your response is not valid'));
      }

      case 'get':
      case 'view': {
        // Check whether there is a key to get
        if (!key) {
          return message.channel.send(Utils.createErrorMessage('You must specify a key to get'));
        }

        // Check whether the key name exists in the settings
        if (!settings[key]) {
          return message.channel.send(Utils.createErrorMessage('The key you specified does not exist in the settings'));
        }

        message.channel.send(Utils.createSuccessMessage(`**${key}** is currently set to: **${settings[key]}**`));
        break;
      }

      default: {
        // Initialize empty strings for the keys and values
        let keys = '';
        let values = '';

        // Iterate through the settings and format the strings properly to display
        Object.entries(settings).forEach(([skey, svalue]) => {
          keys += (`${skey}\n`);
          values += (`${svalue}\n`);
        });

        // Create a new rich embed object to format the message
        const allSettings = new RichEmbed()
          .setColor('#7ED321')
          .setDescription(`Viewing all settings for **${message.guild.name}**`)
          .addField('Setting', keys, true)
          .addField('Value', values, true)
          .setTimestamp();

        message.channel.send(allSettings);
        break;
      }
    }
  }
}

module.exports = Settings;
