const client = require("./index")
const ServerInfos = []
const ytdl = require("ytdl-core");
const Discord = require('discord.js');
const ytpl = require("ytpl")
const config = require("./config.json")
var YouTube = require('youtube-node');
var youTube = new YouTube();
youTube.setKey(config.ytapikey);

class ServerInfo {
    ID
    Channel
    PlayList
    VoiceConnection
    Loop
    CurrentSong
    Dispatcher
    Stop
    constructor(ServerID) {
        this.ID = ServerID;
        this.Channel = null;
        this.PlayList = [];
        this.Loop = false;
        this.Stop = 0;
        this.CurrentSong = null
        this.Dispatcher = null
        ServerInfos.push(this)
    }
    join(GuildID,AuthorID,channel){
        this.Channel = channel;
        return new Promise(function (resolve, reject){
            client.guilds.resolve(GuildID).members.resolve(AuthorID).voice.channel.join().then((connection)=>{
                resolve(connection)
            });
        })
    }
    async getSong(args){
        return new Promise(function (resolve, reject){
            getYoutubeSearch(args).then((res)=>{
                resolve(res)
            })
        })
    }
    player(){
        this.Dispatcher = this.VoiceConnection.play(ytdl(this.CurrentSong.MusicUrl,{filter:"audioonly"}))
    }

}

function getYoutubeSearch(args){
    return new Promise(function(resolve, reject) {
        youTube.search (args.join(), 1, {type:"video"}, async function(error, result) {
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
                MusicUrl="https://www.youtube.com/watch?v="+ result.items[0].id.videoId;
                MusicTitle=JSON.stringify(result.items[0].snippet.title).replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,"&");
                MusicTitle = removeByIndex(removeByIndex(MusicTitle,MusicTitle.length-1),0);
                MusicThumbnail=((await ytdl.getBasicInfo(MusicUrl)).videoDetails.thumbnails[3].url);
                Music={MusicUrl,MusicTitle,MusicThumbnail};
                resolve(Music);
            };
        })});
};
function removeByIndex(str,index) {
    return str.slice(0,index) + str.slice(index+1);
}

module.exports = {ServerInfos,ServerInfo};