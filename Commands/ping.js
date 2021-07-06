const Discord = require('discord.js');
module.exports.run = (client, channel, authorID,interaction=null) => {
    return new Promise(function (resolve, reject){
        resolve("pong")
    })
};

module.exports.help = {
    name: 'ping',
    description:'pings the bot',
    options:[]
};