const ServerInfos = require("../ServerInfos").ServerInfos
const ytdl = require("ytdl-core")
module.exports.run = (client, channel, authorID, args) => {
    return new Promise(async function (resolve,reject){
        for(let i=0;i<ServerInfos.length;i++){
            if(ServerInfos[i].ID==channel.guild.id){
                console.log("Server ID:"+ServerInfos[i].ID)
                ServerInfos[i].join(ServerInfos[i].ID,authorID,channel).then((res)=>{
                    if(typeof res==='string'){
                        resolve(res)
                    } else {
                        ServerInfos[i].VoiceConnection = res
                        ServerInfos[i].getSong(args).then((res)=>{
                            if(typeof (res)==='string'){
                                resolve(res)
                            } else {
                                if(res.Playlist!=undefined){
                                    for(let pos=0;pos<res.Playlist.length;pos++){
                                        ServerInfos[i].PlayList.push(res.Playlist[pos])
                                    }
                                    resolve("Playlist: "+res.Title+" was added to the queue")
                                } else {
                                    ServerInfos[i].PlayList.push(res)
                                    for(let x=0;x<ServerInfos[i].PlayList.length;x++){
                                        console.log(ServerInfos[i].PlayList[x])
                                    }
                                    resolve(res.MusicTitle+" was added to the queue")
                                }
                                if(ServerInfos[i].CurrentSong==null){
                                    ServerInfos[i].CurrentSong = ServerInfos[i].PlayList[0]
                                    ServerInfos[i].player()
                                }}
                        })
                    }
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