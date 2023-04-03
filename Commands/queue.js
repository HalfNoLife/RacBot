const serverInfos = require ("../serverInfos").ServerInfos;

module.exports.run =async (interaction) => {
    return new Promise(function (resolve, reject){
        let serverInfo = serverInfos.find((elm)=>elm.guildId == interaction.guildId)
        let queueInfos ="Your current server Music Queue is:\n";
        for(let i=0;i<serverInfo.playlist.length;i++)
            queueInfos = queueInfos + (i+1) + " - " + serverInfo.playlist[i].musicTitle+"\n"
        if(serverInfo.playlist.length == 0)
            queueInfos = "There is no song on your server playlist for now\n"
        if(serverInfo.Loop){
            queueInfos=queueInfos+("And the playlist is currently looping")
        } else {
            queueInfos=queueInfos+("And the playlist is currently not looping")
        }
        resolve(queueInfos)
    })
};

    module.exports.help = {
        name: 'queue',
        description:'sends information about the server music queue',
        options:[]
    };