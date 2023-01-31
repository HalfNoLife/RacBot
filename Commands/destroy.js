module.exports.run =async (client, channel,authorID, args) => {
    return new Promise(function (resolve, reject){
        const ServerInfos = require ("../ServerInfos").ServerInfos;
        for (let i=0;i<ServerInfos.length;i++){
            if (channel.guild.id==ServerInfos[i].ID){
                ServerInfos[i].PlayList = []
                ServerInfos[i].CurrentSong = null;
                resolve("Playlist destroyed")
            };
        };
    })
};
module.exports.help = {
    name: 'destroy',
    description:'destroys the current music queue',
    options:[]
};