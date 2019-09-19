const { Auditable } = require('../modules/Utils');

class MessageUpdate {
  constructor(client) {
    this.client = client;
  }

  async run(oldMessage, newMessage) {
    const messageInfo = {
      color: '#03fc6b',
      description: `Message edited in #${oldMessage.channel.name} [Jump to message](${newMessage.url})`,
      authorName: newMessage.author.username,
      authorIcon: newMessage.author.avatarURL,
    };
    const args = {
      before: `${oldMessage.content}`,
      after: `${newMessage.content}`,
    };
    Auditable(this.client, oldMessage.guild, messageInfo, args);
  }
}

module.exports = MessageUpdate;
