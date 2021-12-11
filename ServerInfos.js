const client = require("./index")
const ServerInfos = []
const ytdl = require("ytdl-core");
const Discord = require('discord.js');
const ytFunctions = require("./YoutubeFunctions")

class ServerInfo {
    ID
    Channel
    PlayList
    VoiceConnection
    Loop
    CurrentSong
    AudioStream
    Stop
    Prefix
    constructor(ServerID) {
        this.ID = ServerID;
        this.Channel = null;
        this.PlayList = [];
        this.Loop = false;
        this.Stop = 0;
        this.CurrentSong = null
        this.AudioStream = null
        this.Prefix = '!'
        ServerInfos.push(this)
    }
    join(GuildID,AuthorID,channel){
        this.Channel = channel;
        let conditions = this.conditions(channel,AuthorID)
        return new Promise(function (resolve, reject){
            if(conditions==1){
                resolve("You need to be in a voice channel")
            } else if(conditions==2){
                resolve("I don't have permission to speak or to connect to your voice channel")
            }else {
                client.guilds.resolve(GuildID).members.resolve(AuthorID).voice.channel.join().then((connection)=>{
                    resolve(connection)
                });
            }
        })
    }
    async getSong(args){
        this.Stop+=1;
        return new Promise(function (resolve, reject){
            if(args[0]==undefined){
                resolve("You need to specify a music to play")
            } else if(args[0].includes("list=")){
                ytFunctions.getYTPlaylist(ytFunctions.getYTPlaylistID(args[0])).then((res)=>{
                    resolve(res)
                })
            } else if(args[0].includes("watch?v=")){
                ytFunctions.getYTVideo(ytFunctions.getYTVideoID(args[0])).then((res)=>{
                    resolve(res)
                })
            } else {
                ytFunctions.getVideoSearch(args).then((res)=>{
                    resolve(res)
                })
            }
        })
    }
    player(){
        this.CurrentSong = this.PlayList[0]
        const embed = new Discord.MessageEmbed();
        embed.setColor('#ff0000');
        embed.setTitle("Now playing : \n"+this.CurrentSong.MusicTitle);
        embed.setURL(this.CurrentSong.MusicUrl);
        embed.setImage(this.CurrentSong.MusicThumbnail);
        this.Channel.send(embed)
        this.AudioStream = this.VoiceConnection.play(ytdl(this.CurrentSong.MusicUrl,{filter:"audioonly",highWaterMark:1024*128,quality:"140"}))
            .on("finish",()=>{
                if (this.Loop){
                    this.PlayList.push(this.PlayList[0]);
                }
                this.PlayList.shift();
                if(this.PlayList.length>0){
                    if(this.VoiceConnection.channel.members.array().length>1){
                        this.player();
                    } else {
                        this.PlayList = [];
                        this.Loop = false;
                        this.VoiceConnection.disconnect()
                        this.CurrentSong = null;
                        this.Channel.send("I left the channel and reset the queue as I was alone")
                    }
                } else {
                    this.Channel.send("Playlist is now empty")
                    this.CurrentSong = null;
                    let start = this.Stop
                    setTimeout(()=>{
                        if(start==this.Stop){
                            if(this.VoiceConnection!=null){
                                this.VoiceConnection.disconnect()
                            }
                            this.Channel.send("I left the channel as I was alone for 5 minutes")
                        }
                    },5*60*1000)
                }
            })
            .on('error', e => {
                console.log("Error on:"+this.CurrentSong.MusicUrl)
                console.log(e)
                this.PlayList.shift()
                this.Channel.send("An error as occurred while playing:"+this.CurrentSong.MusicTitle+". Automatically skipping it." )
                this.CurrentSong = null
                if(this.PlayList.length>0){
                    this.player()
                }
            })
            .on('start', () => {
                console.log('Play started on'+this.CurrentSong);
            });
    }
    /*
    * 0 -> OK
    * 1 -> Author not connected
    * 2 -> Authorization issue
    */
    conditions(channel,authorID){
        if(client.guilds.resolve(channel.guild.id).members.resolve(authorID).voice.channel == null){
            return 1
        } else if(!client.guilds.resolve(channel.guild.id).members.resolve(authorID).voice.channel.permissionsFor(client.user).has("CONNECT")
            ||!client.guilds.resolve(channel.guild.id).members.resolve(authorID).voice.channel.permissionsFor(client.user).has("SPEAK")){
            return 2
        }
        return 0
    }
}
module.exports = {ServerInfos,ServerInfo};