const { RichEmbed } = require('discord.js');
const Command = require('../models/Command');

class Help extends Command {
  constructor(client) {
    super(client, {
      name: 'help',
      description: 'Gives you a list of all available commands',
      category: 'System',
      usage: 'help [command name]',
      aliases: ['h'],
    });
  }

  async run(message, args, lvl) {
    // If there is no arguments, we can assume the user wants to see all the commands available
    if (!args[0]) {
      const { settings } = message;
      const commands = (message.guild) ? this.client.commands.filter(x => this.client.levelCache[x.conf.permLevel] <= lvl.lvl) : this.client.commands.filter(x => this.client.levelCache[x.conf.permLevel] <= lvl.lvl && x.conf.guildOnly !== true);

      // Sort commands by category, then name
      const sortedCommands = commands.array().sort((a, b) => {
        if (a.help.catagory > b.help.catagory) {
          return 1;
        }
        if (a.help.name > b.help.name && a.help.category === b.help.category) {
          return 1;
        }
        return -1;
      });
      // Create a new rich embed object
      const helpMessage = new RichEmbed()
        .setColor('#7ED321')
        .setTitle('Available commands')
        .setDescription(`Use \`${settings.prefix}help [command name]\` to get more information on a specific command`);

      // Get all available category names
      const categories = [];

      sortedCommands.forEach((command) => {
        if (!categories.includes(command.help.category)) {
          categories.push(command.help.category);
        }
      });

      // Add the commands by category to the message
      categories.forEach((cat) => {
        const filteredCommands = sortedCommands.filter(x => x.help.category === cat);
        const output = [];

        filteredCommands.forEach((x) => {
          output.push(x.help.name);
        });

        helpMessage.addField(cat, output.join(', '));
      });

      // Add the current timestamp
      helpMessage.setTimestamp();

      // Send the message
      message.channel.send(helpMessage);
    } else {
      const commandName = args[0];

      if (this.client.commands.has(commandName)) {
        // Fetch the command object from the commands Collection
        const command = this.client.commands.get(commandName);

        // Don't allow people to request help for commands they don't have access to
        if (lvl.lvl < this.client.levelCache[command.conf.permLevel]) {
          return;
        }

        const helpMessage = new RichEmbed()
          .setColor('#7ED321')
          .setTitle(`Command name: _${command.help.name}_`)
          .setDescription(command.help.description)
          .addField('Usage', command.help.usage)
          .addField('Aliases', command.conf.aliases.join(', '))
          .setTimestamp();

        message.channel.send(helpMessage);
      } else {
        const errorMessage = new RichEmbed()
          .setColor('#D0021B')
          .setDescription(`:octagonal_sign: | Command \`${commandName}\` does not exist`)
          .setTimestamp();

        message.channel.send(errorMessage);
      }
    }
  }
}

module.exports = Help;
