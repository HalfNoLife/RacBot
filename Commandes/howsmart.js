const Discord = require('discord.js');
module.exports.run = (client, message, args) => {
    if ( args == "" ) {
        message.channel.send( "<@" + message.author.id + ">" + "'s IQ = " + Math.floor(Math.random() * 255));
    }
    else {
        message.channel.send(args+ "'s IQ is " + Math.floor(Math.random() * 255));
        
    }
    
}



module.exports.help = {
    name: 'howsmart'
};