module.exports.run =async (client, channel, authorID, args) => {
const ServerInfos = require("../ServerInfos").ServerInfos
return new Promise(function (resolve, reject){
    for (let i=0;i<ServerInfos.length;i++) {
        if (channel.guild.id == ServerInfos[i].ID) {
            if (ServerInfos[i].CurrentSong != null) {
                resolve(ServerInfos[i].CurrentSong.MusicTitle + " was succesfully skipped.")
                ServerInfos[i].AudioStream.end()
            } else {
                resolve("Sorry but their is no songs to skip for now on this server.")
            }
        }
    }
})
};
module.exports.help = {
    name: 'skip',
    description:'skips the current music in the queue',
    options:[]
};