const Discord = require("discord.js");
const fs = require("fs")
module.exports = async(client, message) => {
    let prefix = ''
    const ServerInfos = require("../ServerInfos").ServerInfos
    for(let i=0;i<ServerInfos.length;i++){
        if(message.guild.id==ServerInfos[i].ID){
            prefix=ServerInfos[i].Prefix
            console.log(prefix)
        }
    }
    if(!message.content.startsWith(prefix)) return;
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;
    let bans = await getBans()
    for(i = 0;i<bans.length;i++){
        if(message.author.id == bans[i]){
            message.reply("You are banned")
            return
        }
    }
    const args= message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift();
    console.log(command)
    const cmd = client.commands.get(command);
    if(!cmd) return;
    //console.log(message.author.username)
    cmd.run(client, message.channel, message.author.id , args).then((res)=>{
        let resArr = [""]
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
            for(let i=0;i<resArr.length;i++){
                message.channel.send(resArr[i])
            }
        } else {
            message.channel.send(res)
        }

    });
    addLog(message)
};


function addLog(message){
    console.log("Trying to add log")
    fs.appendFile('./logs.txt', ("Name:"+message.author.username+"\nid:"+message.author.id+"\nrequest:"+message.content)+'\n----------------------------\n', function (err) {
        if (err){
            console.log(err.message)
            throw err;
        }
        else{
            console.log('Saved!');
        }
    });
}

function getBans(){
    return new Promise(async function(resolve){
        fs.readFile("./bans.txt",function (err,res){
            resolve(res.toString().split(/\r?\n/))
        })
    })
}