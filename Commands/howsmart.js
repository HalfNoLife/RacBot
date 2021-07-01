const Discord = require('discord.js');
const config = require("../config.json");
module.exports.run = (client, message, args) => {
    if ( args == "" ) {
        if(message.author.id == config.OwnerID){
            message.channel.send( "<@" + message.author.id + ">" + "'s IQ = " + "infinity");
        } else {
            message.channel.send( "<@" + message.author.id + ">" + "'s IQ = " + Math.floor(Math.random() * 255));
        }

    }
    else {
        message.channel.send(args+ "'s IQ is " + Math.floor(Math.random() * 255));
        
    }
    
}

module.exports.help = {
    name: 'howsmart',
    description:'tells how smart you are',
    options:[
        {
            "name":"someone",
            "description":"The person or the thing you want to know the IQ",
            "required":false,
            "type":3
        }
    ]
};