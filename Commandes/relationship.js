const Discord = require('discord.js');

module.exports.run = (client, message, args) => {
    var user1 = message.author;
    var user2 = message.guild.members.cache.random();
    while (user2.user.bot){
        var user2 = message.guild.members.cache.random();
    }
    message.channel.send("<@" + user1.id + ">"+", will you mary "+ "<@" + user2.id + ">"+ "?");
    
};

module.exports.help = {
    name: 'relationship'
};