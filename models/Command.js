class Command {
  constructor(client, {
    name = null,
    description = 'No description available',
    category = 'No category',
    usage = 'No usage examples available',
    enabled = true,
    guildOnly = true,
    aliases = new Array(),
    permLevel = 'Member'
  }) {
    this.client = client;
    this.help = { name, description, category, usage }
    this.conf = { enabled, guildOnly, aliases, permLevel }
  }
}

module.exports = Command;
