const Discord = require("discord.js");


module.exports.help = {
  name:"ping"
}

module.exports.run = async (client, message, args) => {
  message.channel.send('pong');
}