const serverInfos = require ("../serverInfos").ServerInfos;
const status = require("../status")
module.exports.run =async (interaction) => {
    return new Promise(function (resolve){
        let serverInfo = serverInfos.find((elm)=>elm.guildId == interaction.guildId)
        let position = interaction.options.get("position") != null ? parseInt(interaction.options.get("position").value) : 1;
        if(!Number.isInteger(position))
            resolve(status.removeNotANumberError)
        if (position >= 1 && position <= serverInfo.playlist.length){
            resolve(serverInfo.playlist[position-1].musicTitle+" was succesfully removed from the paylist")
            serverInfo.playlist.splice(position-1,1)
        } else if(serverInfo.playlist.length==0){
            resolve(status.removeNoSongsError)
        } else {
            resolve("Please specify a number between 1 and "+(serverInfo.playlist.length)+".")
        }
    })
};
module.exports.help = {
    name: 'remove',
    description:'removes by index a music in the server queue',
    options:[{
        "name":"position",
        "description":"the place of the music in the queue",
        "required":false,
        "type":4
    }]
};