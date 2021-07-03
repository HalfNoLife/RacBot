module.exports.run =async (client, channel, authorID, args) => {
    const ServerInfos = require("../ServerInfos").ServerInfos
    return new Promise(function (resolve,reject){
        for (let i=0;i<ServerInfos.length;i++){
            if (channel.guild.id==ServerInfos[i].ID){
                shuffle(ServerInfos[i].PlayList)
                resolve("shuffled")
            };
        };
    })
};
module.exports.help = {
    name: 'shuffle',
    description:'shuffles the server music queue',
    options:[]
};

function shuffle(arr){
    for(let i=0;i<arr.length;i++){
        let j=Math.floor(Math.random() * arr.length);
        let mem = arr[j]
        arr[j] = arr[i]
        arr[i] = mem
    }
    return arr
}