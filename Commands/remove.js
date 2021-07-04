module.exports.run =async (client, channel, authorID, args) => {
    const ServerInfos = require ("../ServerInfos").ServerInfos;
    return new Promise(function (resolve, reject){
        for (let i=0;i<ServerInfos.length;i++){
            if(channel.guild.id==ServerInfos[i].ID){
                if(args[0]==undefined||args[0]==1){
                    resolve(ServerInfos[i].PlayList[0].MusicTitle+" was succesfully removed from the paylist")
                    ServerInfos[i].PlayList.splice(0,1)
                } else if ((Number.isInteger(parseInt(args[0])))&&(parseInt(args[0])>1)&&(parseInt(args[0])<=ServerInfos[i].PlayList.length)){
                    resolve(ServerInfos[i].PlayList[parseInt(args[0])-1].MusicTitle+" was succesfully removed from the paylist")
                    ServerInfos[i].PlayList.splice(args[0]-1,1)
                } else if(ServerInfos[i].PlayList.length==0){
                    resolve("There is no songs in your current playlist")
                } else {
                    resolve("Please specify a number between 1 and "+(ServerInfos[i].PlayList.length)+".")
                }
            }
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