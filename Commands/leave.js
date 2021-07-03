module.exports.run =async (client, channel, author, args) => {
    const ServerInfos = require ("../ServerInfos").ServerInfos;
    return new Promise(function (resolve, reject){
        for (let i=0;i<ServerInfos.length;i++){
            if (channel.guild.id==ServerInfos[i].ID){
                ServerInfos[i].Dispatcher.end()
                ServerInfos[i].PlayList = []
                ServerInfos[i].CurrentSong = null
                ServerInfos[i].VoiceConnection.disconnect()
                resolve("See you")
            };
        };
    })
};
module.exports.help = {
    name: 'leave',
    description:'leaves the voice channel',
    options:[]
};