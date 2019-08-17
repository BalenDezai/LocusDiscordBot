class ready {
  constructor(client) {
    this.client = client;
  }

  async run() {
    // Discord.js is sometimes slow to gather all guild data and some of it will come
    // after the ready event, so we wait 600ms
    await this.client.wait(600);

    // Cyclically gather application information
    this.client.appInfo = await this.client.fetchApplication();
    setInterval(async () => {
      this.client.appInfo = await this.client.fetchApplication();
    }, 60000);

    // Load up the default settings to Enmap
    if (!this.client.settings.has('default')) {
      if (!this.client.Config.defaultSettings) {
        throw new Error('The defaultSettings property is not present in config.js file.');
      }

      this.client.settings.set('default', this.client.Config.defaultSettings);
    }

    // Set activity message
    this.client.user.setActivity('woah', { type: 'LISTENING' });

    // Log to the console that we're ready to rock
    this.client.logger.log(`${this.client.user.tag} is ready.\nI'm currently on ${this.client.guilds.size} guilds, serving ${this.client.users.size} users.`);
  }
}

module.exports = ready;
