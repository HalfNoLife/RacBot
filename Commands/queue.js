module.exports.run =async (client, channel,authorID, args) => {
    return new Promise(function (resolve, reject){
        console.log("Queue called")
        const ServerInfos = require ("../ServerInfos").ServerInfos;
        for (let i=0;i<ServerInfos.length;i++){
            if((channel.guild.id==ServerInfos[i].ID)){
                var answered = false;
                console.log("Server found")
                var queueInfos ="Your current server Music Queue is:\n";
                for(let q=0;q<ServerInfos[i].PlayList.length;q++){
                    queueInfos=queueInfos+(q+1)+": "+ServerInfos[i].PlayList[q].MusicTitle+"\n"
                    if(queueInfos.length>1500){
                        if(!answered){
                            resolve(queueInfos)
                            answered = true
                        } else {
                            channel.send(queueInfos)
                        }
                        queueInfos=""
                    }
                }
                if(ServerInfos[i].PlayList.length==0){
                    console.log("Playlist is empty")
                    queueInfos="There is no song on your server playlist for now\n"
                }
                if(ServerInfos[i].Loop){
                    queueInfos=queueInfos+("And the playlist is currently looping")
                } else {
                    queueInfos=queueInfos+("And the playlist is currently not looping")
                }
                if(ServerInfos[i].CurrentSong!=null){
                    queueInfos+="\nCurrently playing: "+ServerInfos[i].CurrentSong.MusicTitle
                }
                if(!answered){
                    console.log("not answered")
                    resolve(queueInfos)
                } else {
                    console.log("answered")
                    channel.send(queueInfos)
                }

            }

        }
        resolve("error")
    })
};

    module.exports.help = {
        name: 'queue',
        description:'sends information about the server music queue',
        options:[]
    };