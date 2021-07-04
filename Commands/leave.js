module.exports.run =async (client, channel, author, args) => {
    const ServerInfos = require ("../ServerInfos").ServerInfos;
    return new Promise(function (resolve, reject){
        for (let i=0;i<ServerInfos.length;i++){
            if (channel.guild.id==ServerInfos[i].ID){
                if(ServerInfos[i].VoiceConnection!=null && ServerInfos[i].VoiceConnection!=undefined){
                    ServerInfos[i].VoiceConnection.disconnect()
                    resolve("See you")
                } else {
                    resolve("I do not seem to be connected on this server")
                }
            };
        };
    })
};
module.exports.help = {
    name: 'leave',
    description:'leaves the voice channel',
    options:[]
};