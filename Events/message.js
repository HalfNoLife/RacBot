const Discord = require("discord.js");
const prefix = "!";
const fs = require("fs")
module.exports = async(client, message) => {
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
    const commande = args.shift();
    const cmd = client.commands.get(commande);
    if(!cmd) return;
    cmd.run(client, message, args);
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