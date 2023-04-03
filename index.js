const { Client, Events, GatewayIntentBits } = require('discord.js');
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

function removeCommand(id){
    client.application.commands.delete(id)
}

function postCommand(command){
    client.application.commands.create(client.user.id).commands.post({data:{
            name: command.name,
            description: command.description,
            options:command.options
        }})
}


async function getCommands(){
    return new Promise(async function (resolve,reject){
        resolve(await client.application.commands.fetch())
    })
}

function isPresentOnBot(name,commands){
    for(var command of commands){
        if(command[1].name == name){
            return true
        }
    }
    return false
}
function isPresentOnDiscord(name,commands){
    for(let i = 0; i<commands.length; i++)
    {
        if(commands[i].name == name)
        {
            return true
        }
    }
    return false
}

client.on('ready',()=>{
    getCommands().then((slashCommands)=>{
        for(var i=0;i<GlobalCommands.length;i++){
            if(!isPresentOnBot(GlobalCommands[i].name,slashCommands)){
                console.log("Posting command: " + GlobalCommands[i].name)
                postCommand(GlobalCommands[i])
            }
        }
        for(var slashCommand of slashCommands){
            if(!isPresentOnDiscord(slashCommand[1].name,GlobalCommands)){
                console.log("Removing command: " + slashCommand[1].name)
                removeCommand(slashCommand[1].id)
            }
        }
    })
    for(var guild of client.guilds.cache.entries()){
        new ServerInfo.ServerInfo(guild[0])
    }
})

client.on('guildCreate',(guild)=>{
    new ServerInfo.ServerInfo(guild.id)
})

client.on("guildDelete",(guild)=>{
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
            substrings = []
            for (let i = 0; i < reply.length; i += 2000)
                substrings.push(reply.substr(i, 2000));
            interaction.editReply(substrings[0])
            for(let i = 1;i < substrings.length;i++)
                interaction.channel.send(substrings[i])
        }
        else
        {
            interaction.editReply({
                embeds: [reply]
            })
        }
    })
})
