const serverInfos = require("../serverInfos").ServerInfos
module.exports.run =async (interaction) => {    
    return new Promise(function (resolve, reject){
        let serverInfo = serverInfos.find((elm)=>elm.guildId == interaction.guildId)
        serverInfo.audioStream.pause();
        resolve("Music paused")
    })
};
module.exports.help = {
    name: 'pause',
    description:'pauses the music',
    options:[]
};