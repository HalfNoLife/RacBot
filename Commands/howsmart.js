const Discord = require('discord.js');
const config = require("../config.json");
module.exports.run = (client, channel, authorID, args) => {
    return new Promise(function (resolve, reject){
        if ( args == null || args.length==0) {
            resolve("<@"+authorID + "> 's IQ = " + Math.floor(Math.random() * 255))
        }
        else {
            var str = ""
            for(var i=0;i<args.length;i++){
                for(var y=0;y<args[i].length;y++){
                    str+=args[i][y]
                }
                str+=" "
            }
            resolve(str+ "'s IQ is " + Math.floor(Math.random() * 255));
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