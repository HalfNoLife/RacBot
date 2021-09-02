const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("./config.json")
const fs=require('fs');
client.login(config.token);
client.commands = new Discord.Collection();
console.log("Online!")
const GlobalCommands = []
module.exports = client
const ServerInfo = require("./ServerInfos")
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

client.on('ready',()=>{
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
    })
    let servers = client.guilds.cache.array()
    for(let i=0;i<servers.length;i++){
        new ServerInfo.ServerInfo(servers[i].id)
        console.log("Server found:" + servers[i].name)
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

function removeCommand(id){
    client.api.applications(client.user.id).commands(id).delete()
}

function postCommand(command){
    client.api.applications(client.user.id).commands.post({data:{
            name: command.name,
            description: command.description,
            options:command.options
        }})
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
        if(typeof(interaction.data.options[0].value)==='number'){
            args = [interaction.data.options[0].value] //Assuming we only have a single arg
        } else {
            args = interaction.data.options[0].value.split(/ +/g);
        }
    } else {
        args = null;
    }
    const cmd = client.commands.get(interaction.data.name)
    let channel = client.channels.resolve(interaction.channel_id)
    let IsBanned = false;
    getBans().then(bans=>{
        for(let i = 0;i<bans.length;i++){
            if(interaction.member.user.id == bans[i]){
                IsBanned = true
            }
        }
        if(IsBanned){
            client.api.interactions(interaction.id,interaction.token).callback.post({
                data:{
                    type:4,
                    data:{
                        content:"<@"+interaction.member.user.id+">, You are banned"
                    }
                }
            })
            return
        }
        cmd.run(client,channel,interaction.member.user.id,args).then(async (res)=>{
            let resArr = []
            let shift = 1500
            if(typeof res ==='string' && res.length>1500){
                resArr.push("")
                for(let i=0;i<res.length;i++){
                    resArr[resArr.length-1]+=res[i]
                    if(res[i]=='\n' && i>shift){
                        resArr.push("")
                        shift+=1500
                    }
                }
                res=resArr[0]
            }
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
            for(let i=1;i<resArr.length;i++){
                channel.send(resArr[i])
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

function getBans(){
    return new Promise(async function(resolve){
        fs.readFile("./bans.txt",function (err,res){
            resolve(res.toString().split(/\r?\n/))
        })
    })
}
