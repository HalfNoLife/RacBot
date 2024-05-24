const serverInfos = require("../serverInfos").ServerInfos
module.exports.run =async (interaction) => {
    return new Promise(function (resolve,reject){
        let serverInfo = serverInfos.find((elm)=>elm.guildId == interaction.guildId)
        if(serverInfo.playlist.length>0)
        {
            shuffle(serverInfo.playlist)
            resolve("Playlist shuffled!")
        }
        else
            resolve("There is no songs to shuffle in your playlist!")
        
    })
};
module.exports.help = {
    name: 'shuffle',
    description:'shuffles the server music queue',
    options:[]
};

function shuffle(arr){
    for(let i=1;i<arr.length;i++){
        let j=Math.floor(Math.random() * arr.length-1)+1;
        let mem = arr[j]
        arr[j] = arr[i]
        arr[i] = mem
    }
    return arr
}