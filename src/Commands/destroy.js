const serverInfos = require ("../serverInfos").ServerInfos;

module.exports.run =async (interaction) => {
    return new Promise(function (resolve, reject){
        let serverInfo = serverInfos.find((elm)=>elm.guildId == interaction.guildId)
        serverInfo.playlist.splice(1)
        resolve("Playlist destroyed")
    })
};
module.exports.help = {
    name: 'destroy',
    description:'destroys the current music queue',
    options:[]
};