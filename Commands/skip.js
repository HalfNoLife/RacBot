const serverInfos = require("../serverInfos").ServerInfos
const status = require("../status")

module.exports.run = async (interaction) => {
    return new Promise(function (resolve, reject){
        let serverInfo = serverInfos.find((elm)=>elm.guildId == interaction.guildId)
        if(serverInfo.audioStream != null && serverInfo.audioStream.state.status != 'idle')
        {
            serverInfo.audioStream.stop()
            resolve("Music skiped succesfully")
        }
        else
            resolve(status.currentlyNotPlayingError)
    })
};

module.exports.help = {
    name: 'skip',
    description:'skips the current music in the queue',
    options:[]
};