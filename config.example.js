const config = {
  "botAdmins": [''],
  "token": '',

  "defaultSettings": {
    "prefix": 'locus ',
    "modLogChannel": 'mod-log',
    "modRoleName": 'Moderator',
    "adminRoleName": 'Administrator',
    "systemNotice": true,
    "welcomeEnabled": false,
    "welcomeChannel": 'general',
    "welcomeMessage": 'Welcome {{user}}!'
  },

  "permLevels": [
    {
      lvl: 0,
      name: 'Member',
      check: () => true
    },
    {
      lvl: 1,
      name: 'Moderator',
      check: (message) => {
        try {
          const modRole = message.guild.roles.find(r => r.name.toLowerCase() === message.settings.modRoleName.toLowerCase());
          if (modRole && message.member.roles.has(modRole.id)) return true;
        } catch (e) {
          return false;
        }
      }
    },
    {
      lvl: 2,
      name: 'Administrator',
      check: (message) => {
        try {
          const adminRole = message.guild.roles.find(r => r.name.toLowerCase() === message.settings.adminRoleName.toLowerCase());
          if (adminRole && message.member.roles.has(adminRole.id)) return true;
        } catch (e) {
          return false;
        }
      }
    },
    {
      lvl: 3,
      name: 'Server Owner',
      check: (message) => {
        message.channel.type === 'text' ? (message.guild.owner.user.id === message.author.id ? true : false) : false;
      }
    },
    {
      lvl: 9,
      name: 'Bot Administrator',
      check: (message) => config.botAdmins.includes(message.author.id)
    },
    {
      lvl: 10,
      name: 'Bot Owner',
      check: (message) => (message.client.appInfo.owner.id === message.author.id)
    }
  ]
};

module.exports = config;