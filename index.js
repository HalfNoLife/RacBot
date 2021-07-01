const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("./config.json")
const fs=require('fs');
client.login(config.token);
client.commands = new Discord.Collection();
console.log("Online!")
const GlobalCommands = []
const https=require("https")
module.exports = client
const ServerInfo = require("./ServerInfos").ServerInfo
fs.readdir("./Commands/",(error, f) =>{
    if(error) console.log(error);

    let commands = f.filter(f => f.split(".").pop() === "js");
    if(commands.length <=0) return console.log("No commands found !")

    commands.forEach((f) => {
        let command = require(`./Commands/${f}`);
        client.commands.set(command.help.name, command);
        GlobalCommands.push({name:command.help.name,description:command.help.description,options:command.help.options})
        console.log("Command loaded: "+ command.help.name)
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

client.on('ready',()=>{
    console.log("Client ready, retrieving commands")
    getCommands().then((SlashCommands)=>{
        for(var i=0;i<GlobalCommands.length;i++){
            if(!isPresent(GlobalCommands[i],SlashCommands)){
                postCommand(GlobalCommands[i])
            }
        }
        for(var i=0;i<SlashCommands.length;i++){
            if(!isPresent(SlashCommands[i],GlobalCommands)){
                removeCommand(SlashCommands[i].id)
            }
        }
        console.log("Commands managed(not updated)")
    })
    let servers = client.guilds.cache.array()
    for(let i=0;i<servers.length;i++){
        new ServerInfo(servers[i].id)
    }
})

function removeCommand(id){
    client.api.applications(client.user.id).commands(id).delete()
    console.log("Command removed")
}

function postCommand(command){
    client.api.applications(client.user.id).commands.post({data:{
            name: command.name,
            description: command.description,
            options:command.options
        }})
    console.log("Command: "+command.name+" pushed")
}


async function getCommands(){
    return new Promise(async function (resolve,reject){
        const res = await client.api.applications(client.user.id).commands.get()
        resolve(res)
    })
}

function isPresent(command,commands){
    for(var i=0;i<commands.length;i++){
        if(commands[i].name==command.name){
            return true
        }
    }
    return false
}

client.ws.on('INTERACTION_CREATE', async interaction => {
    var args;
    if(interaction.data.options != undefined){
        args = interaction.data.options[0].value.split(/ +/g);
    } else {
        args = null;
    }
    const cmd = client.commands.get(interaction.data.name)
    cmd.run(client,client.channels.resolve(interaction.channel_id),interaction.member.user.id,args).then(async (res)=>{
        let data = {
            content:res
        }
        //Check for embeds
        if(typeof res==='object'){
            data = await createAPImessage(interaction,res)
        }
        client.api.interactions(interaction.id,interaction.token).callback.post({
            data:{
                type:4,
                data
            }
        })
    })
})

async function createAPImessage(interaction, content){
    const {data,files} = await Discord.APIMessage.create(
        client.channels.resolve(interaction.channel_id),
        content
    )
        .resolveData()
        .resolveFiles()
    return{...data,files}
}

