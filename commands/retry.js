const { prefix } = require("../config.json");

module.exports = {
  config: {
    name: "retry",
    description: "Retry to complete the captcha",
    usage: `${prefix}retry`,
  },
  async run(bot, message) {
    bot.emit("guildMemberAdd", message.author);
  },
};
