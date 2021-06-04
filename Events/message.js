const Discord = require("discord.js");
const prefix = "!";
const fs = require("fs")
module.exports = async(client, message) => {
    var bans = require("../config.json")
    if(!message.content.startsWith(prefix)) return;
    addLog(message)
    for(i = 0;i<bans.bannedUsersIds.length;i++){
        if(message.author.id == bans.bannedUsersIds[i]){
            message.reply("You are banned")
            return
        }
    }
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;
    const args= message.content.slice(prefix.length).trim().split(/ +/g);
    const commande = args.shift();
    const cmd = client.commands.get(commande);
    if(!cmd) return;
    cmd.run(client, message, args);
};
function addLog(message){
    console.log(message)
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