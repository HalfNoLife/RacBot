const Discord = require('discord.js');
module.exports.run = (client, message, args,interaction=null) => {
    let start = Date.now();

    message.channel.send('Ping')
        .then((m) => m.edit(`Pong : **${Date.now() - start}**ms`));
};

module.exports.help = {
    name: 'ping',
    description:'pings the bot',
    options:[]
};