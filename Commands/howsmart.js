const Discord = require('discord.js');
const config = require("../config.json");
module.exports.run = (interaction) => {
    return new Promise(function (resolve, reject){
        if ( interaction.options.get("someone") == null) {
            resolve("<@"+interaction.member.id + "> 's IQ = " + Math.floor(Math.random() * 150))
        }
        else {
            resolve(interaction.options.get("someone").value+ "'s IQ is " + Math.floor(Math.random() * 150));
        }
    })
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