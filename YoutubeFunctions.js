const ytpl= require("ytpl");
const ytdl = require("ytdl-core")
const ytsr = require('ytsr');
const fs = require("fs")
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
const ffmpeg = require('fluent-ffmpeg')
ffmpeg.setFfmpegPath(ffmpegPath)
const config = require("./config.json");

function isLive(search_result)
{
    for(let i=0; i<search_result.badges.length; i++)
    {
        if (search_result.badges[i] == "LIVE" || search_result.badges[i] == "PREMIERE")
        {
            return true;
        }
    }
    return false;
}

function getVideoSearch(args)
{
    return new Promise(async (resolve,reject)=>{
        const search_result = await ytsr(args.join(" "),{
            limit:1,
            requestOptions:{
                headers:{
                    'cookie':config.ytcookie,
                    'x-youtube-identity-token':config.ytidtoken,
                }
            }
        });
        let Title = search_result.items[0].title;
        let Musics = [];
        if(search_result.items[0].type == "video"){
            let MusicUrl = search_result.items[0].url;
            let MusicTitle = search_result.items[0].title;
            let MusicThumbnail = search_result.items[0].bestThumbnail.url;
            let MusicIsLive = isLive(search_result.items[0]);
            let Music={MusicUrl,MusicTitle,MusicThumbnail,MusicIsLive};
            Musics.push(Music);
            let Result = {Title, Musics};
            resolve(Result)
        } else {
            ytpl(search_result.items[0].playlistID,{
                limit:Infinity,
                requestOptions:{
                    headers:{
                        'cookie':config.ytcookie,
                        'x-youtube-identity-token':config.ytidtoken,
                    }
                }
            }).then(playlist=>{
                for(let i=0;i<playlist.items.length;i++){
                    let MusicUrl=playlist.items[i].shortUrl;
                    let MusicTitle=playlist.items[i].title;
                    let MusicThumbnail=playlist.items[i].bestThumbnail.url;
                    let MusicIsLive = isLive(playlist.items[i]);
                    let Music={MusicUrl,MusicTitle,MusicThumbnail,MusicIsLive};
                    Musics.push(Music);
                }
                let Result = {Title, Musics};
                resolve(Result)
            })
        }
    })
}

function convertWavToMp3(wavFilename){
    return new Promise((resolve, reject) => {
        const outputFile = wavFilename.replace(".wav", ".mp3");
        ffmpeg({
            source: wavFilename,
        }).on("error", (err) => {
            reject(err);
        }).on("end", () => {
            fs.unlinkSync(wavFilename);
            resolve(outputFile);
        }).save(outputFile);
    });
}

async function downloadAudio(url){
    return new Promise(function (resolve,reject){
        var stream =ytdl(url,{filter:"audioonly",requestOptions:{headers:{Cookie:config.ytcookie}}})
        var FileName = "./Downloads/";
        stream
        .on("info", (info) => {
            FileName += (info.videoDetails.title).replace(/[^a-z0-9]/gi, '_')+".wav";
            stream.pipe(fs.createWriteStream(FileName));
        })
        .on("error",(error)=>{
            if(error.statusCode==403){
                console.log("Couldn't access a video")
            } else {
                console.log(error)
            }
        })
        .on("end",()=>{
                resolve(convertWavToMp3(FileName))
        })
    })
}


module.exports = {getVideoSearch,downloadAudio}