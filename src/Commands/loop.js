const serverInfos = require("../serverInfos").ServerInfos

module.exports.run =async (interaction) => {
    return new Promise(function (resolve, reject){
        let serverInfo = serverInfos.find((elm)=>elm.guildId == interaction.guildId)
        serverInfo.isLooping = !serverInfo.isLooping;
        resolve(serverInfo.isLooping ? "playlist is now looping!" : "playlist is now not looping!")
    })
}

module.exports.help = {
    name: 'loop',
    description:'loops the current music queue',
    options:[]
};