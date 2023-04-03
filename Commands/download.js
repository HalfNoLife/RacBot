const {getVideoSearch,downloadAudio} = require("../youtubeFunctions")
const fs = require("fs")
const status = require("../status")
module.exports.run =async (interaction) => {
    return new Promise(function (resolve){
        getVideoSearch(interaction.options.get("song").value).then((result)=>{
            if (result.musics.length == 1) {
                resolve("Trying to download your song please wait...")
                downloadAudio(result.musics[0].musicUrl).then((fileName)=>{
                    interaction.channel.send({
                        content:result.musics[0].musicTitle+" was downloaded",
                        files:[
                            fileName
                        ]
                    }).then(()=>{
                        fs.unlinkSync(fileName)
                    })
                })
            } else {
                resolve(status.playlistDownloadError);
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