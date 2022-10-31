const {getVideoSearch,downloadAudio} = require("../YoutubeFunctions")
const fs = require("fs")
module.exports.run =async (client, channel, authorID, args) => {
    return new Promise(function (resolve,reject){
        getVideoSearch(args).then((Result)=>{
            if (Result.Musics.length == 1) {
                resolve("Trying to download your song please wait...")
                downloadAudio(Result.Musics[0].MusicUrl).then((FileName)=>{
                    channel.send(Result.Musics[0].MusicTitle+" was downloaded",{
                        files:[
                            FileName
                        ]
                    }).then(()=>{
                        fs.unlinkSync(FileName)
                    })
                })
            } else {
                resolve("Sorry, the bot does not support playlist downloading for now");
            }
        })
    })
};
module.exports.help = {
    name: 'download',
    description:'sends the music downloaded from youtube as audio format in the channel',
    options:[{
        "name":"song",
        "description":"the song to download",
        "required":true,
        "type":3
    }]
};
