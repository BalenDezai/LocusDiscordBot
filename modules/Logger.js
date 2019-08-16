const chalk = require('chalk');

class Logger {
  static log(content, type = 'log') {
    const currentTimestamp = `<${new Date().toString()}>`;

    switch (type) {
      case 'log':
        return console.log(`${currentTimestamp} ${chalk.bgBlue(type.toUpperCase())}\n${content}`);
      case 'debug':
        return console.log(`${currentTimestamp} ${chalk.bgWhite(type.toUpperCase())}\n${content}`);
      case 'error':
        return console.log(`${currentTimestamp} ${chalk.bgRed(type.toUpperCase())}\n${content}`);
      case 'warning':
        return console.log(`${currentTimestamp} ${chalk.bgYellow(type.toUpperCase())}\n${content}`);
      case 'success':
        return console.log(`${currentTimestamp} ${chalk.bgGreen(type.toUpperCase())}\n${content}`);
      default:
        throw new Error('Incorrect/unsupported logging type');
    }
  }

  static error(content) {
    return this.log(content, 'error');
  }

  static warning(content) {
    return this.log(content, 'warning');
  }

  static debug(content) {
    return this.log(content, 'debug');
  }
}

module.exports = Logger;
