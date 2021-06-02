const config = require("../config.json")
module.exports.run =async (client, message, args) => {
    const ban = require("./ban")
    if(message.author.id == config.OwnerID){
        if(args[0]==undefined){
            message.reply("You forgot to precise who should I unban")
        } else {
            found = false;
            for(i =0;i<ban.banedUserIds.length && !found;i++){
                if(args[0]==ban.banedUserIds[i]){
                    found = true
                    ban.banedUserIds.splice(i)
                }
            }
            message.reply("user: "+args[0]+" was successfully unbanned")
        }
    } else {
        message.reply("Sorry, only my owner my decide who I should unban")
    }
};

module.exports.help = {
    name: 'unban'
};