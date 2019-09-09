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

    // retrieve the table to check if it exists
    const table = this.client.sql.prepare('SELECT count(*) FROM sqlite_master WHERE type=\'table\' and name=\'scores\';').get();

    if (!table['count(*)']) {
      // if the table isnt in the db file, create it
      this.client.sql.prepare('CREATE TABLE scores (id TEXT PRIMARY KEY, user TEXT, guild TEXT, points INTEGER, level INTEGER);').run();
      // make ID row unique and index it
      this.client.sql.prepare('CREATE UNIQUE INDEX idx_scores_id ON scores (id);').run();
      this.client.sql.pragma('synchronous = 1');
      this.client.sql.pragma('journal_mode = wal');
    }

    this.client.getPointScore = this.client.sql.prepare('SELECT * FROM scores WHERE user = ? AND guild = ?');
    this.client.setPointScore = this.client.sql.prepare('INSERT OR REPLACE INTO scores (id, user, guild, points, level) VALUEs (@id, @user, @guild, @points, @level);');
    // Set activity message
    this.client.user.setActivity('woah', { type: 'LISTENING' });

    // Log to the console that we're ready to rock
    this.client.logger.log(`${this.client.user.tag} is ready.\nI'm currently on ${this.client.guilds.size} guilds, serving ${this.client.users.size} users.`);
  }
}

module.exports = ready;
