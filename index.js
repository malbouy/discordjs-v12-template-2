const config = require("./config.json");
const token = config.token
const Discord = require("discord.js");
const fs = require("fs");
const client = new Discord.Client({
  disableEveryone: true
});
client.commands = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {

  if(err) console.log(err);

  let jsfile = files.filter(f => f.split(".").pop() === "js")
  if(jsfile.length <= 0){
    console.log("Bruh go get a life, why are there no commands?");
    return;
  }

  jsfile.forEach((f, i) =>{
    let props = require(`./commands/${f}`);
    console.log(`${f} loaded!`);
    client.commands.set(props.help.name, props);
  });

});

client.on("ready", async () => {
  console.log(`${client.user.username} is online`);
});

client.on("message", async message => {
  if(message.author.bot) return;
  if(message.channel.type === "dm") return;

  let prefix = config.prefix;
  let ctn = message.content.split(" ");
  let cmd = ctn[0];
  let args = ctn.slice(1);
  
  let commandfile = client.commands.get(cmd.slice(prefix.length));
  if(commandfile) commandfile.run(client,message,args);

});

client.login(token);