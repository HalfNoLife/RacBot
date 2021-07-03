module.exports.run =async (client, channel, authorID, args) => {
    const ServerInfos = require("../ServerInfos").ServerInfos
    return new Promise(function (resolve, reject){
        for(let i=0;i<ServerInfos.length;i++){
            if(ServerInfos[i].ID == channel.guild.id){
                ServerInfos[i].Loop = !ServerInfos[i].Loop
                if(ServerInfos[i].Loop){
                    resolve("Playlist is now looping")
                } else {
                    resolve("Playlist is now not looping")
                }
            }
        }
    })
}
module.exports.help = {
    name: 'loop',
    description:'loops the current music queue',
    options:[]
};