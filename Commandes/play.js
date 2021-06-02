//requiring and initiating differents modules
const ytdl = require("ytdl-core");
const Discord = require('discord.js');
const { Attachment, RichEmbed } = require('discord.js');
const ytpl = require("ytpl")
const config = require("../config.json")
var YouTube = require('youtube-node');
var youTube = new YouTube();
youTube.setKey(config.ytapikey);





//Class Queue containing a server musique queue informations
//Array Queues, array containing all the Queues for all the servers
var Queues = [];
class Queue {
    id="";
    queue=[];
    channel={};
    voiceconnection={};
    loop=false;
    CurrentSong=null;
    dispatcher={};
    constructor(message,song){
        this.id=message.guild.id
        this.channel=message.channel
        if(conditions(message)){
            message.member.voice.channel.join().then((connection)=>{
                this.voiceconnection=connection
                this.addsong(song)
            })
        }
    }
    addsong(song){
        if(song[0].startsWith("https://www.youtube.com/playlist?list=")){
            getPlaylist(song[0],this.channel).then((Playlist)=>{
                var i=0;
                for(;i<Playlist.length;i++){
                    this.queue.push(Playlist[i])
                }
                if(this.CurrentSong==null){
                    this.player()
                }
            })
            
        } else if(song[0].startsWith("https://www.youtube.com/watch?v=")){
            getMusic(song[0],this.channel).then((Music)=>{
                this.queue.push(Music)
                if(this.CurrentSong==null){
                    this.player()
                }
            })
        } else {
            getYoutubeSearch(song,this.channel).then((Music)=>{
                if(Music!=null){
                    this.queue.push(Music)
                    if(this.CurrentSong==null){
                        this.player()
                    }
                }
            })
        }
    }
    reconnectToChan(message,song){
        message.member.voice.channel.join().then((connection)=>{
            this.channel = message.channel
            this.voiceconnection=connection
            this.addsong(song)
        })
    }
    player(){
        if(this.queue.length>0){
            this.CurrentSong=this.queue[0]
            const embed = new Discord.MessageEmbed()
            embed.setColor('#ff0000')
            embed.setTitle("Now playing : \n"+this.CurrentSong.MusicTitle)
            embed.setURL(this.CurrentSong.MusicUrl)
            embed.setImage(this.CurrentSong.MusicThumbnail)
            this.channel.send(embed)
            this.dispatcher = this.voiceconnection.play(ytdl(this.CurrentSong.MusicUrl,{filter:"audioonly"},{ quality: '140' },{highWaterMark:1024*128})).on("finish",()=>{
                if (this.loop){
                    this.queue.push(this.queue[0])
                    this.queue.shift();
                    this.player()
                } else {
                    this.queue.shift();
                    this.player()
                }
            })
            this.voiceconnection.on("disconnect",()=>{

                if(this.voiceconnection!=null){
                    this.channel.send("See you!")
                }
                this.voiceconnection = null
                this.dispatcher.end()
                this.queue = []
                this.CurrentSong = null
            })

        } else {
            this.queue=[]
            this.channel.send("Queue is now empty")
            this.CurrentSong=null;
            this.voiceconnection.disconnect()
        }
    }
}
module.exports.run = (client, message, args) => {
    if(conditions(message)){
        var found=false
        for(i=0;i<Queues.length&&!found;i++){
            if(Queues[i].key==message.guild.id){
                var found = true
                Queues[i].value.reconnectToChan(message,args)
            }
        }
        if(!found){
            Queues.push({
                key:message.guild.id,
                value:new Queue(message,args)
            })
        }
    }
    module.exports=Queues;
}
function conditions(message){
    if (!message.member.voice.channel){
        message.reply("You must be in a voice channel to use this command. If you are in one check its permissions.")
        return false
    } else {
    const permissions = message.member.voice.channel.permissionsFor(message.client.user)
        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")){
            message.reply("I need permissions to talk and to connect on the channel you are using.")
            return false
        } else { 
            return true
        }
    }
}
function getYoutubeSearch(args,channel){
    return new Promise(function(resolve, reject) {
    youTube.search (args.join(), 1, {type:"video"}, async function(error, result) {
    
        if (error) {
            console.log(error);
            channel.send("Sorry their an unexpected error has occured when searching on Youtube :(")
            resolve(null)
        }else if (result.pageInfo.totalResults == 0){
            channel.send("Sorry their is no match on youtube for your request :(")
            resolve(null)
        } else {
            MusicUrl="https://www.youtube.com/watch?v="+ result.items[0].id.videoId;
            MusicTitle=JSON.stringify(result.items[0].snippet.title).replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,"&")
            MusicTitle = removeByIndex(removeByIndex(MusicTitle,MusicTitle.length-1),0)
            MusicThumbnail=((await ytdl.getBasicInfo(MusicUrl)).videoDetails.thumbnails[3].url)
            Music={MusicUrl,MusicTitle,MusicThumbnail}
            channel.send(MusicTitle+" was added to the queue")
            resolve(Music)
        }
    })})
}


//search the corresponding playlist to url on youtube returns an array of Musics
function getPlaylist(url,channel){
    return new Promise(async function(resolve){
        ytpl(getID(url)).then(playlist=>{
            Playlist=[]
            for(i=0;i<playlist.items.length;i++){
                MusicUrl="https://www.youtube.com/watch?v="+playlist.items[i].id
                MusicTitle=playlist.items[i].title.replace("|","")
                MusicThumbnail=playlist.items[i].bestThumbnail.url
                Music={MusicUrl,MusicTitle,MusicThumbnail}
                Playlist.push(Music)
                if(i==99){
                    channel.send("Sorry but for now we are limiting playlist length to 100.")
                    i=playlist.items.length
                }
            }
            const embed = new Discord.MessageEmbed()
            embed.setColor('#FF0000')
            embed.setTitle("Playlist: "+playlist.title + " was succefully added to the queue")
            embed.setURL(url)
            embed.setImage(playlist.thumbnails[0].url)
            channel.send(embed)
            resolve(Playlist)
        })
        
    })
}
//search the corresponding url on youtube returns a Music
function getMusic(url,channel){
    return new Promise (async function(resolve){
        if (url.length>43){
            MusicUrl="https://www.youtube.com/watch?v="+formatURL(url)
        } else {
            MusicUrl=url
        }
            ytdl.getBasicInfo(MusicUrl).then(infos=>{
                MusicTitle= infos.videoDetails.title
                MusicThumbnail=infos.videoDetails.thumbnails[3].url
                Music={MusicUrl,MusicTitle,MusicThumbnail}
                channel.send(MusicTitle+" was added to the queue")
                resolve(Music)
            }
        )
    })
}
function removeByIndex(str,index) {
    return str.slice(0,index) + str.slice(index+1);
}
function getID(url){
    id=""
    for(i=0;i<url.length-38;i++){
        id=id+url[i+38]
    }
    return id
}
function formatURL(url){
    i=0
    for(;i<url.length&&url[i]!='=';){
        i++
    }
    id="";
    for(;i<url.length&&url[i]!='&';){
        i++
        id=id+url[i]
    }
    return id
}
module.exports.help = {
    name: 'play'
};
