const Discord = require('discord.js');

module.exports.run = (client, channel, authorID, args) => {
    return new Promise(function (resolve,reject){
        let user2 = channel.guild.members.cache.random();
        while (user2.user.bot){
            user2 = channel.guild.members.cache.random();
        }
        resolve("<@" + authorID + ">"+", will you mary "+ "<@" + user2.id + ">"+ "?");
    })
};

module.exports.help = {
    name: 'relationship',
    description:'asks a random user on the server whether or not he wants to marry you',
    options:[]
};