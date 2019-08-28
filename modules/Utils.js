const { RichEmbed } = require('discord.js');

class Utils {
  /**
   * Ready-made rich embed for error messages
   * @param {String} messageText text to display as an error message
   * @returns Pre-formatted RichEmbed object with the error message
   */
  static createErrorMessage (messageText) {
    const errorMessage = new RichEmbed()
      .setColor('#D0021B')
      .setDescription(`:octagonal_sign: | ${ messageText }`)
      .setTimestamp();
    
    return errorMessage;
  }

  /**
   * Ready-made rich embed for success messages
   * @param {String} messageText text to display as a success message
   * @returns Pre-formatted RichEmbed object with the success message
   */
  static createSuccessMessage (messageText) {
    const successMessage = new RichEmbed()
      .setColor('#7ED321')
      .setDescription(`:white_check_mark: | ${ messageText }`)
      .setTimestamp();
    
    return successMessage;
  }
}

module.exports = Utils;
