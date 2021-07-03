module.exports.run =async (client, channel, authorID, args) => {
    const ServerInfos = require("../ServerInfos").ServerInfos
    return new Promise(function (resolve, reject){
        for(let i=0;i<ServerInfos.length;i++){
            if(ServerInfos[i].ID==channel.guild.ID){
                ServerInfos[i].join(channel.guild.id,authorID,channel)
                resolve("Joined")
            }
        }
    })
};
module.exports.help = {
    name: 'join',
    description:'makes me join your voice channel',
    options:[]
};