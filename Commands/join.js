module.exports.run =async (client, channel, authorID, args) => {
    const ServerInfos = require("../ServerInfos").ServerInfos
    return new Promise(function (resolve, reject){
        for(let i=0;i<ServerInfos.length;i++){
            if(ServerInfos[i].ID==channel.guild.id){
                if(ServerInfos[i].conditions(channel,authorID) == 0){
                    ServerInfos[i].join(channel.guild.id,authorID,channel)
                    resolve("Joined")
                } else if(ServerInfos[i].conditions(channel,authorID)==1){
                    resolve("You must be connected to a voice channel so I can join")
                } else {
                    resolve("I don't have permission to speak or to connect to your voice channel")
                }
            }
        }
    })
};
module.exports.help = {
    name: 'join',
    description:'makes me join your voice channel',
    options:[]
};