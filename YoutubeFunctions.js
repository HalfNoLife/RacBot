const ytpl= require("ytpl");
const ytdl = require("ytdl-core")
const ytsr = require('ytsr');
const fs = require("fs")

const config = require("./config.json");



function getVideoSearch(args)
{
    return new Promise(async (resolve,reject)=>{
        const search_result = await ytsr(args.join(" "),{limit:1});
        let Title = search_result.items[0].title;
        let Musics = [];
        if(search_result.items[0].type == "video"){
            let MusicUrl = search_result.items[0].url;
            let MusicTitle = search_result.items[0].title;
            let MusicThumbnail = search_result.items[0].bestThumbnail.url;
            let Music={MusicUrl,MusicTitle,MusicThumbnail};
            Musics.push(Music);
            let Result = {Title, Musics};
            resolve(Result)
        } else {
            ytpl(search_result.items[0].playlistID,{limit:Infinity}).then(playlist=>{
                for(let i=0;i<playlist.items.length;i++){
                    let MusicUrl=playlist.items[i].shortUrl;
                    let MusicTitle=playlist.items[i].title;
                    let MusicThumbnail=playlist.items[i].bestThumbnail.url;
                    let Music={MusicUrl,MusicTitle,MusicThumbnail};
                    Musics.push(Music);
                }
                let Result = {Title, Musics};
                resolve(Result)
            })
        }
    })
}

async function downloadAudio(url){
    return new Promise(function (resolve,reject){
        var stream =ytdl(url,{filter:"audioonly"})
        var FileName;
        stream
        .on("info", (info) => {
            FileName = (info.videoDetails.title).replace(/[^a-z0-9]/gi, '_')+".wav";
            stream.pipe(fs.createWriteStream("./Downloads/"+FileName));
        })
        .on("error",(error)=>{
            if(error.statusCode==403){
                console.log("Couldn't access a video")
            } else {
                console.log(error)
            }
        })
        .on("end",()=>{
                resolve(FileName)
        })
    })
}


module.exports = {getVideoSearch,downloadAudio}