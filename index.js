/* Check node version, to prevent the bot from running in older/deprecated versions of Node.js */
if (Number(process.version.slice(1).split('.')[0]) < 10) {
  throw new Error('Node 10 or higher is required to run this instance of the bot. Please check your Node version and update accordingly.');
}

const { promisify } = require('util');
const readdir = promisify(require('fs').readdir);
const klaw = require('klaw');
const path = require('path');
const LocusBot = require('./modules/LocusBot');

/* Initialize new client class */
const client = new LocusBot();

const init = async () => {
  /** Load commands from directory into memory */
  klaw('./commands', { depthLimit: 2 }).on('data', (item) => {
    const commandFile = path.parse(item.path);

    // Ignore everything that's not a file or a .js file
    if (!commandFile.ext || commandFile.ext !== '.js') return;

    const commandLoaded = client.loadCommand(commandFile.dir, `${commandFile.name}`);
    if (commandLoaded) client.logger.log(`Loaded command: ${commandLoaded}`, 'log');
  });

  /** Load events from a directory into memory */
  const eventFiles = await readdir('./events');
  client.logger.log(`Loading ${eventFiles.length} event files...`, 'log');

  eventFiles.forEach((file) => {
    const eventName = file.split('.')[0];
    client.logger.log(`Loading event: ${eventName}`);

    const event = new (require(`./events/${file}`))(client);

    client.on(eventName, (...args) => event.run(...args));

    // Clean the cache of the event once we're done
    delete require.cache[require.resolve(`./events/${file}`)];
  });

  /** Set the client's permission level cache */
  for (let i = 0; i < client.Config.permLevels.length; i += 1) {
    const currentLvl = client.Config.permLevels[i];
    client.levelCache[currentLvl.name] = currentLvl.lvl;
  }

  /** Login the client using the specified token */
  client.login(client.Config.token);
};

// Run the asynchronous init function
init();

// Set event listeners for different connection states
client.on('disconnect', () => { client.logger.warn('Locus is shutting down...'); })
  .on('reconnecting', () => { client.logger.log('Locus is reconnecting...', 'log'); })
  .on('error', (error) => { client.logger.error(error); })
  .on('warn', (warning) => { client.logger.warning(warning); })
  .on('guildCreate', guild => console.log(guild));

process.on('uncaughtException', (error) => {
  console.error(`Uncaught exception: ${error.stack}`);
  process.exit(1);
});
