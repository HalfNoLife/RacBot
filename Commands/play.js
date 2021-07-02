const ServerInfos = require("../ServerInfos").ServerInfos
const ytdl = require("ytdl-core")
module.exports.run = (client, channel, authorID, args) => {
    return new Promise(async function (resolve,reject){
        for(let i=0;i<ServerInfos.length;i++){
            if(ServerInfos[i].ID==channel.guild.id){
                console.log("Server ID:"+ServerInfos[i].ID)
                ServerInfos[i].join(ServerInfos[i].ID,authorID,channel).then((connection)=>{
                    ServerInfos[i].VoiceConnection = connection
                    ServerInfos[i].getSong(args).then((res)=>{
                        if(typeof (res)==='string'){
                            resolve(res)
                        } else {
                            ServerInfos[i].PlayList.push(res)
                            for(let x=0;x<ServerInfos[i].PlayList.length;x++){
                                console.log(ServerInfos[i].PlayList[x])
                            }
                            if(ServerInfos[i].CurrentSong==null){
                                ServerInfos[i].CurrentSong = res
                                ServerInfos[i].player()
                                console.log("Player called")
                            }
                            resolve(res.MusicTitle+" was added to the queue")
                        }
                    })
                })

            }
        }
    })
};

module.exports.help = {
    name: 'play',
    description:'adds the given music by searching for it on youtube to the queue',
    options:[
        {
            "name":"music",
            "description":"the music you want to play",
            "required":true,
            "type":3
        }
    ]
};