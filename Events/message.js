const Discord = require("discord.js");
const prefix = "!";
module.exports = async(client, message) => {
    const ban = require("../Commandes/ban")
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;
    if(!message.content.startsWith(prefix)) return;
    if(ban.banedUserIds!=undefined){
        for(i=0;i<ban.banedUserIds.length;i++){
            if(ban.banedUserIds[i]==message.author.id){
                message.reply("You are banned")
                return
            }
        }
    }
    const args= message.content.slice(prefix.length).trim().split(/ +/g);
    const commande = args.shift();
    const cmd = client.commands.get(commande);
    if(!cmd) return;
    cmd.run(client, message, args);
};