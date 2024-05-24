const axios = require("axios")
const ytdl = require("ytdl-core")
const fs = require("fs")
const he = require("he")

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
const ffmpeg = require('fluent-ffmpeg')
ffmpeg.setFfmpegPath(ffmpegPath)

const config = require("./config.json");

function getVideoSearch(args)
{
    return new Promise(async (resolve,reject)=>{
        const search_result = (await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(args)}&key=${config.ytDataApiV3}`)).data;
        let title = he.decode(search_result.items[0].snippet.title);
        let musics = [];
        if(search_result.items[0].id.kind == "youtube#video"){
            let musicUrl = `https://www.youtube.com/watch?v=${search_result.items[0].id.videoId}`;
            let musicTitle = he.decode(search_result.items[0].snippet.title);
            let musicThumbnail = search_result.items[0].snippet.thumbnails.high.url;
            let musicIsLive = false;//search_result.badges.some(badge => badge === "LIVE" || badge === "PREMIERE")
            let music={musicUrl,musicTitle,musicThumbnail,musicIsLive};
            musics.push(music);
            resolve({title, musics})
        } else {
            let firstIter = true
            do {
                var playlist = (await axios.get(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${encodeURIComponent(search_result.items[0].id.playlistId)}${firstIter ? '' : `&pageToken=${playlist.nextPageToken}`}&key=${config.ytDataApiV3}`)).data
                if (firstIter) firstIter = false
                for(let i = 0; i<playlist.items.length; i++){
                    let musicUrl=`https://www.youtube.com/watch?v=${playlist.items[i].snippet.resourceId.videoId}`;
                    let musicTitle=he.decode(playlist.items[i].snippet.title);
                    let musicThumbnail=playlist.items[i].snippet.thumbnails.high.url;
                    let musicIsLive = false;
                    let music={musicUrl,musicTitle,musicThumbnail,musicIsLive};
                    musics.push(music);
                }
            } while (playlist.nextPageToken != undefined);
            resolve({title, musics})
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
        let stream =ytdl(url,{
            filter: "audioonly",
            highWaterMark:1<<25,
            maxReconnect:5,
            requestOptions:{
                headers:{
                    'cookie':config.ytCookie,
                    'x-youtube-identity-token':config.ytIdToken,
                }
            }
        })
        let downloadFolder = "./Downloads/";
        let fileName;
        if (!fs.existsSync(downloadFolder)) 
            fs.mkdirSync(downloadFolder, { recursive: true });

        stream
        .on("info", (info) => {
            fileName = downloadFolder + (info.videoDetails.title).replace(/[^a-z0-9]/gi, ' ')+".wav";
            stream.pipe(fs.createWriteStream(fileName));
        })
        .on("error",(error)=>{
            if(error.statusCode==403){
                console.log("Couldn't access a video")
            } else {
                console.log(error)
            }
        })
        .on("end",()=>{
                resolve(convertWavToMp3(fileName))
        })
    })
}


module.exports = {getVideoSearch,downloadAudio}