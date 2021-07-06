module.exports.run =async (client, channel, authorID, args) => {
    const ServerInfos = require("../ServerInfos").ServerInfos
    return new Promise(function (resolve, reject){
        for (let i=0;i<ServerInfos.length;i++){
            if (ServerInfos[i].ID==channel.guild.id && ServerInfos[i].AudioStream != null){
                ServerInfos[i].AudioStream.pause()
                resolve("Music paused")
            };
        };
    })
};
module.exports.help = {
    name: 'pause',
    description:'pauses the music',
    options:[]
};