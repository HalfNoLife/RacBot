const ytdl = require("@distube/ytdl-core")
const ytsr = require("@distube/ytsr")
const config = require("./config.json")
const agent = ytdl.createAgent(config.cookies)
const fs = require("fs")

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
const ffmpeg = require('fluent-ffmpeg')
ffmpeg.setFfmpegPath(ffmpegPath)

async function getVideoSearch(request){
    return new Promise(async resolve => {
        ytsr(request, {  limit: 1 }).then(result => {
            if(result.items[0].type === "video") {
                let musicUrl = result.items[0].url
                let musicTitle = result.items[0].name
                let musicThumbnail = result.items[0].thumbnail
                let musicIsLive = result.items[0].isLive
                resolve({musicUrl,musicTitle,musicThumbnail,musicIsLive})
            }
          })
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

function getVideoStream(music){
    return ytdl(music.musicUrl, { 
        agent: agent,
        quality: music.musicIsLive ? [91, 92, 93, 94, 95] : "highestaudio",
        filter: music.musicIsLive ? null : "audioonly",
        liveBuffer: music.musicIsLive ? 4900 : null,
        highWaterMark: 1<<25,
        dlChunkSize: 0,
    })
}

module.exports = {getVideoSearch, downloadAudio, getVideoStream}