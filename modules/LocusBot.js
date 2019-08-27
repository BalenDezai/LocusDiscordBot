const { Client, Collection } = require('discord.js');
const { promisify } = require('util');
const path = require('path');
const Enmap = require('enmap');

class LocusBot extends Client {
  constructor(options) {
    super(options);

    this.Config = require('../config');

    /* Create collections for commands and aliases for each command */
    this.commands = new Collection();
    this.aliases = new Collection();

    /* Create individual settings for each server using Enmap */
    this.settings = new Enmap({
      name: 'serverSettings',
      cloneLevel: 'deep',
      fetchAll: false,
      autoFetch: true,
    });

    /* Easier console logging */
    this.logger = require('./Logger');

    /* We don't use no setTimeout here >:) */
    this.wait = promisify(setTimeout);

    /* Initialize level cache as an object */
    this.levelCache = {};
  }

  permLevel(message) {
    let permLvl = 0;

    const permOrder = this.Config.permLevels.slice(0).sort((a, b) => (a.lvl < b.lvl ? 1 : -1));

    while (permOrder.length) {
      const currentLvl = permOrder.shift();
      if (message.guild && currentLvl.guildOnly) continue;
      if (currentLvl.check(message)) {
        permLvl = currentLvl;
        break;
      }
    }

    return permLvl;
  }

  /* Load and unload commands */
  loadCommand(commandPath, commandName) {
    try {
      const props = new (require(`${commandPath}${path.sep}${commandName}`))(this);
      this.logger.log(`Loading command: ${props.help.name}`, 'log');

      props.conf.location = commandPath;
      if (props.init) {
        props.init(this);
      }

      this.commands.set(props.help.name, props);
      props.conf.aliases.forEach((alias) => {
        this.aliases.set(alias, props.help.name);
      });

      return false;
    } catch (err) {
      return `Unable to load command ${commandName} ->\n${err}`;
    }
  }

  async unloadCommand(commandPath, commandName) {
    let command;
    if (this.commands.has(commandName)) {
      command = this.commands.get(commandName);
    } else if (this.aliases.has(commandName)) {
      command = this.commands.get(this.aliases.get(commandName));
    }

    if (!command) {
      return `The command or alias '${commandName}' does not exist.`;
    }

    if (command.shutdown) {
      await command.shutdown(this);
    }

    delete require.cache[require.resolve(`${commandPath}${path.sep}${commandName}`)];
    return false;
  }

  /* Gets default/overridden settings for guilds from Enmap */
  getSettings(guildId) {
    const defaults = this.Config.defaultSettings || {};
    const guildData = this.settings.get(guildId) || {};
    const settings = {};

    Object.keys(defaults).forEach((key) => {
      settings[key] = guildData[key] ? guildData[key] : defaults[key];
    });

    return settings;
  }

  /* Override or add configuration items to specific guilds */
  updateSettings(guildId, newSettings) {
    const defaults = this.settings.get('default');
    let settings = this.settings.get(guildId);

    if (typeof settings !== 'object') settings = {};

    Object.keys(newSettings).forEach((key) => {
      if (defaults[key] !== newSettings[key]) {
        settings[key] = newSettings[key];
      } else {
        delete settings[key];
      }
    });

    this.settings.set(guildId, settings);
  }
}

module.exports = LocusBot;
