const Discord = require("discord.js");
const fs = require("fs");
const client = new Discord.Client({disableEveryone: true});
client.commands = new Discord.Collection();
const config = require("./config.json");

//If u have giveaways, if not remove this...
const { GiveawaysManager } = require('discord-giveaways');

client.giveawaysManager = new GiveawaysManager(client, {
    storage: "./giveaways.json",
    updateCountdownEvery: 30000,
    default: {
        botsCanWin: false,
        exemptPermissions: ["MANAGE_SERVER", "ADMINISTRATOR"],
        embedColor: "#FF0000",
        reaction: "🎉"
    }
});


client.login(config.token)

client.on('ready', async() => {
  console.log(`Connected to discord and logged in as ${client.user.tag}`)
  client.user.setActivity(config.game + ` | ${config.prefix}help`,{ type: 'WATCHING' })
});

fs.readdir('./commands', (err, files) => {
    if (err) console.log(err)
    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if (jsfile.length <= 0) {
        console.log('No commands have been found why not make some!')
        return;
    }

    jsfile.forEach((file, i) => {
        let props = require(`./commands/${file}`)
        console.log(`${file} has been loaded`)
        client.commands.set(props.help.name, props)
    })

    client.on('message', async message => {
        let prefix = config.prefix

        if (!message.content.startsWith(prefix)) return
        if (message.author.bot || message.channel.type === "dm") return

        let messageArray = message.content.split(' ')
        let cmd = messageArray[0]
        let args = messageArray.splice(1)
        let commandFile = client.commands.get(cmd.slice(prefix.length))

        if (commandFile) commandFile.run(client, message, args)
    })
})
