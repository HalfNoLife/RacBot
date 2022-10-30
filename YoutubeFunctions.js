const ytpl= require("ytpl");
const ytdl = require("ytdl-core")
const fs = require("fs")
var YouTube = require('youtube-node');
const config = require("./config.json");
var youTube = new YouTube();
youTube.setKey(config.ytapikey);

function getYTPlaylistID(url){
    for(let i=0;i<url.length;i++){
        if(url.substr(i,5)=="list="){
            return url.substr(i+5,34)
        }
    }
}
function getYTVideoID(url){
    for(let i=0;i<url.length;i++){
        if(url.substr(i,8)=="watch?v="){
            return url.substr(i+8,11)
        }
    }
}


function getYTPlaylist(ID){
    return new Promise(async function(resolve){
        ytpl(ID,{limit:Infinity}).then(playlist=>{
            let Playlist=[]
            for(i=0;i<playlist.items.length;i++){
                let MusicUrl=playlist.items[i].shortUrl
                let MusicTitle=playlist.items[i].title.replace("|","")
                let MusicThumbnail=playlist.items[i].bestThumbnail.url
                let Music={MusicUrl,MusicTitle,MusicThumbnail}
                Playlist.push(Music)
            }
            resolve({Playlist:Playlist,Title:playlist.title})
        })
    })
}
function getYTVideo(ID){
    return new Promise (async function(resolve){
        let MusicUrl="https://www.youtube.com/watch?v="+ID
        ytdl.getBasicInfo(MusicUrl)
            .then((infos)=>{
                    let MusicTitle= infos.videoDetails.title
                    let MusicThumbnail=infos.videoDetails.thumbnails[3].url
                    let Music={MusicUrl,MusicTitle,MusicThumbnail}
                    resolve(Music)
                }
            ).catch((error)=>{
                console.log(error)
                if(error.statusCode == 410){
                    resolve("Sorry the video you searched for seems to be community flagged.")
                } else {
                    resolve("Sorry I can't find this video :(")
                }
            })
    })
}
function getVideoSearch(args){
    return new Promise((resolve, reject) => {
        youTube.search (args.join(), 1, {type:"video"}, async (error, result) => {
            if (error) {
                console.log(error);
                if(error.code==403){
                    resolve("Sorry request quota exceeded :(, You will have to wait until tomorrow for the quota to reset");
                } else {
                    resolve("Sorry their an unexpected error has occurred when searching on Youtube :(");
                }
            }else if (result.pageInfo.totalResults == 0){
                resolve("Sorry their is no match on youtube for your request :(");
            } else {
                let MusicUrl="https://www.youtube.com/watch?v="+ result.items[0].id.videoId;
                let MusicTitle=JSON.stringify(result.items[0].snippet.title).replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,"&");
                MusicTitle = removeByIndex(removeByIndex(MusicTitle,MusicTitle.length-1),0);
                ytdl.getBasicInfo(MusicUrl).then((details)=>{
                    let MusicThumbnail = details.videoDetails.thumbnails[3].url
                    let Music={MusicUrl,MusicTitle,MusicThumbnail};
                    resolve(Music);
                }).catch((error)=>{
                    if(error.statusCode == 410){
                        resolve("Sorry the video you searched for seems to be community flagged.")
                    }
                })
            };
        })});
};
async function downloadAudio(url){
    return new Promise(function (resolve,reject){
        try{
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
        } catch {
            console.log("Something went wrong while downloading an audio file, make sure you specified a valid URL")
        }
    })

}
function removeByIndex(str,index) {
    return str.slice(0,index) + str.slice(index+1);
}

module.exports = {getYTPlaylist,getYTPlaylistID,getYTVideoID,getYTVideo,getVideoSearch,downloadAudio}