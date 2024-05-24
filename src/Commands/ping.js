const Discord = require('discord.js');
module.exports.run = (interaction) => {
    return new Promise(resolve =>{
        resolve("Pong!")
    })
};

module.exports.help = {
    name: 'ping',
    description:'pings the bot',
    options:[]
};