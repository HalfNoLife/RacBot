const ServerInfos = require("../ServerInfos").ServerInfos
const YoutubeFunctions = require("../YoutubeFunctions")

module.exports.run = (client, channel, authorID, args) => {
    return new Promise(async function (resolve,reject){
        for(let i=0;i<ServerInfos.length;i++){
            if(ServerInfos[i].ID==channel.guild.id){
                ServerInfos[i].join(ServerInfos[i].ID,authorID,channel).then((res)=>{
                    if(typeof res ==='string'){
                        resolve(res)
                    } else {
                        ServerInfos[i].VoiceConnection = res
                        YoutubeFunctions.getVideoSearch(args).then((res)=>{
                            if(typeof (res)==='string'){
                                resolve(res)
                            } else {
                                resolve(res.Title + " was added to the queue.");
                                for(let m = 0; m < res.Musics.length; m++){
                                    ServerInfos[i].PlayList.push(res.Musics[m]);
                                }
                                if(ServerInfos[i].CurrentSong==null){
                                    ServerInfos[i].CurrentSong = ServerInfos[i].PlayList[0]
                                    ServerInfos[i].player()
                                }
                            }
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