const client = require("./index")
const config = require("./config.json")
const ServerInfos = []
const ytdl = require("ytdl-core");
const Discord = require('discord.js');


class ServerInfo {
    ID
    Channel
    PlayList
    VoiceConnection
    Loop
    CurrentSong
    AudioStream
    Prefix
    constructor(ServerID) {
        this.ID = ServerID;
        this.Channel = null;
        this.PlayList = [];
        this.Loop = false;
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
    
    player(){
        let finished = false
        this.CurrentSong = this.PlayList[0]
        let embed = new Discord.MessageEmbed();
        embed.setColor('#ff0000');
        embed.setTitle("Now playing : \n"+this.CurrentSong.MusicTitle);
        embed.setURL(this.CurrentSong.MusicUrl);
        embed.setImage(this.CurrentSong.MusicThumbnail);
        this.Channel.send(embed)
        this.AudioStream = this.VoiceConnection.play(ytdl(this.CurrentSong.MusicUrl+"&bpctr=9999999999&has_verified=1",{filter:"audioonly",highWaterMark:1<<25,maxReconnect:5,quality:"140",
        requestOptions:{
            headers:{
                Cookie:config.ytcookie
            }
        }}))
            .on("finish",()=>{
                finished = true
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
                    this.VoiceConnection.disconnect()
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
                console.log('Play started on: '+this.CurrentSong.MusicTitle);
            })
            this.VoiceConnection.on('disconnect' ,()=>{
                if(!finished){
                    this.AudioStream.end()
                    this.CurrentSong = null
                    this.PlayList = []
                    this.Channel.send("Goodbye")
                }
            })
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