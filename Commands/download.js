const {getYTPlaylist,getYTPlaylistID,getYTVideoID,getYTVideo,getVideoSearch,downloadAudio} = require("../YoutubeFunctions")
const fs = require("fs")
module.exports.run =async (client, channel, authorID, args) => {
    return new Promise(function (resolve,reject){
        getSong(args).then((Music)=>{
            console.log(Music)
            downloadAudio(Music.MusicUrl).then((FileName)=>{
                console.log(Music.MusicTitle+" was downloaded")
                channel.send(FileName+" was downloaded",{
                    files:[
                        "./Downloads/"+FileName
                    ]
                }).then(()=>{
                    fs.unlinkSync("./Downloads/"+FileName)
                })
            })
        })
        resolve("Trying to download your song please wait...")
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
async function getSong(args){
    return new Promise(function (resolve, reject){
        if(args[0]==undefined){
            resolve("You need to specify a music to download")
        } else if(args[0].includes("list=")){
            resolve("The bot doesn't handle playlist downloading for now")
        } else if(args[0].includes("watch?v=")){
            getYTVideo(getYTVideoID(args[0])).then((res)=>{
                resolve(res)
            })
        } else {
            getVideoSearch(args).then((res)=>{
                resolve(res)
            })
        }
    })
}
