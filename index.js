const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("./config.json")
const fs=require('fs');
client.login(config.token);
client.commands = new Discord.Collection();
console.log("Online!")
const GlobalCommands = []
const https=require("https")
fs.readdir("./Commands/",(error, f) =>{
    if(error) console.log(error);
    
    let commands = f.filter(f => f.split(".").pop() === "js");
    if(commands.length <=0) return console.log("No commands found !")
    
    commands.forEach((f) => {
        let command = require(`./Commands/${f}`);
        client.commands.set(command.help.name, command);
        GlobalCommands.push({name:command.help.name,description:command.help.description})
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
        for(var i=0;i<SlashCommands.length;i++){
            removeCommand(SlashCommands[i].id)
        }
        for(var i=0;i<GlobalCommands.length;i++){
            postCommand(GlobalCommands[i].name,GlobalCommands[i].description)
        }
    })
})

function removeCommand(id){
    client.api.applications(client.user.id).commands(id).delete()
    console.log("Command removed")
}

function postCommand(name,description){
    client.api.applications(client.user.id).commands.post({data:{
            name: name,
            description: description
        }})
    console.log("Command: "+name+" pushed")
}


async function getCommands(){
    return new Promise(async function (resolve,reject){
        const res = await client.api.applications(client.user.id).commands.get()
        resolve(res)
    })
}

client.ws.on('INTERACTION_CREATE', async interaction => {
    console.log(interaction)
    const cmd = client.commands.get(interaction.data.name)
    //client.channels.cache.get(interaction.channel_id).send("lol")
    console.log(cmd)
    client.api.interactions(interaction.id,interaction.token).callback.post({
        data:{
            type:4,
            data:{
                content:"Sorry I don't handle requests this way for now. You can use !"+interaction.data.name+" instead."
            }
        }
    })
})
