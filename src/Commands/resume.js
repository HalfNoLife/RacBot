const serverInfos = require("../serverInfos").ServerInfos
module.exports.run =async (interaction) => {
    return new Promise(function (resolve, reject){
        let serverInfo = serverInfos.find((elm)=>elm.guildId == interaction.guildId)
        serverInfo.audioStream.unpause();
        resolve("Music unpaused")
    })
};
module.exports.help = {
    name: 'resume',
    description:'resumes the music',
    options:[]
};