const Discord = require('discord.js');

module.exports.run = (interaction) => {
    return new Promise(function (resolve,reject){
        let user2 = interaction.guild.members.cache.random();
        while (user2.user.bot){
            user2 = interaction.guild.members.cache.random();
        }
        resolve("<@" + interaction.member.id + ">"+", will you mary "+ "<@" + user2.id + ">"+ "?");
    })
};

module.exports.help = {
    name: 'relationship',
    description:'asks a random user on the server whether or not he wants to marry you',
    options:[]
};