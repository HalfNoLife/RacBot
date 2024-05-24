const { Client, Events, GatewayIntentBits, MessageAttachment } = require('discord.js');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates
  ]
});
const Discord = require("discord.js")
const config = require("./config.json")
const fs=require('fs');
client.login(config.token);
client.commands = new Discord.Collection();
console.log("Online!")
const GlobalCommands = []
const https=require("https")
module.exports = client
const ServerInfo = require("./serverInfos")
fs.readdir("./Commands/",(error, f) =>{
    if(error) console.log(error);

    let commands = f.filter(f => f.split(".").pop() === "js");
    if(commands.length <=0) return console.log("No commands found !")

    commands.forEach((f) => {
        let command = require(`./Commands/${f}`);
        client.commands.set(command.help.name, command);
        GlobalCommands.push({name:command.help.name,description:command.help.description,options:command.help.options})
    });
});


fs.readdir("./Events/", (error, f) => {
    if(error) console.log(error);

    f.forEach((f)=>{
        const events = require(`./Events/${f}`);
        const event = f.split(".")[0];
        client.on(event, events.bind(null, client));
    });
});

client.on('ready', async () => {
    let commands = []
    fs.readdir("./Commands/",(error, f) => {
        if(error) console.log(error);

        let files = f.filter(f => f.split(".").pop() === "js");
        if(files.length <=0) return console.log("No commands found !")

        files.forEach((file) => {
            let command = require(`./Commands/${file}`);
            commands.push({
                name:command.help.name,
                description:command.help.description,
                options:command.help.options
            })
        });
    });
    let upCommands = await client.application.commands.fetch();
    commands.forEach(command => {
        if(!upCommands.some(upCommand => upCommand.name === command.name)){
            console.log(`Creating command ${command.name}`)
            client.application.commands.create({
                    name: command.name,
                    description: command.description,
                    options: command.options
            })
        }
    });
    upCommands.forEach(upCommand => {
        if(!commands.some(command => command.name === upCommand.name)){
            console.log(`Deleting command ${upCommand.name}`)
            client.application.commands.delete(upCommand.id)
        }
    })
    for(var guild of client.guilds.cache.entries()){
        new ServerInfo.ServerInfo(guild[0])
    }
})

client.on(Events.GuildCreate,(guild)=>{
    new ServerInfo.ServerInfo(guild.id)
})

client.on(Events.GuildDelete,(guild)=>{
    for(let i=0;i<ServerInfo.ServerInfos.length;i++){
        if(guild.id==ServerInfo.ServerInfos[i].ID){
            ServerInfo.ServerInfos.splice(i,1)
        }
    }
})

client.on(Events.InteractionCreate, async interaction => {
    await interaction.deferReply();
    cmd = require(`./Commands/${interaction.commandName}`)
    cmd.run(interaction).then(async reply => {
        if(typeof reply === 'string')
        {
            if (reply.length<2000){
                interaction.editReply(reply)
            }
            else
            {
                interaction.editReply({
                    content: 'Command response is too long, see full reply in this file.',
                    files: [{
                        attachment: Buffer.from(reply, 'utf-8'),
                        name: 'RacBot Response.txt'
                    }],
                });
            }
        }
        else
        {
            interaction.editReply({
                embeds: [reply]
            })
        }
    })
})
