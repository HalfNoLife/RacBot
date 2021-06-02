const banedUserIds = []
const config= require("../config.json")
module.exports.run =async (client, message, args) => {
    if(message.author.id == config.OwnerID){
        if(args[0]==undefined){
            message.reply("You forgot to precise who should I ban")
        } else {
            if(banedUserIds.includes(args[0])){
                message.reply("This user is already banned master")
            } else {
                if(args[0] == config.OwnerID){
                    message.reply("I can't ban you, you are my Owner")
                } else {
                    banedUserIds.push(args[0])
                    message.reply("user: "+args[0]+" was successfully banned")
                }
            }
        }
    } else {
        message.reply("Sorry, only my owner my decide who I should ban")
    }
    module.exports = {banedUserIds};
};

module.exports.help = {
    name: 'ban'
};