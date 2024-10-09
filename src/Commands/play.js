const serverInfos = require("../serverInfos").ServerInfos
const youtubeFunctions = require("../youtubeFunctions")
const status = require("../status")
const config = require("../config.json")
const fs = require("fs")
const { joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior } = require('@discordjs/voice');
const ytdl = require("@distube/ytdl-core");
const agent = ytdl.createAgent(config.cookies)
const { EmbedBuilder,PermissionsBitField  } = require("discord.js");



function testPlayConditions(interaction) {
    if(interaction.member.voice.channel == null)
        return status.notInVoiceChannel;
    else if(!interaction.member.voice.channel.permissionsFor(interaction.client.user).has(PermissionsBitField.Flags.Connect))
        return status.connectPermissionError;
    else if(!interaction.member.voice.channel.permissionsFor(interaction.client.user).has(PermissionsBitField.Flags.Speak))
        return status.speakPermissionError;
    else
        return status.ok;
}

async function playSong(serverInfo)
{
    serverInfo.playlist[0].musicEnded = false
    serverInfo.audioStream.play(createAudioResource(
        ytdl(serverInfo.playlist[0].musicUrl, { 
            agent: agent,
            quality: serverInfo.playlist[0].musicIsLive ? [91, 92, 93, 94, 95] : "highestaudio",
            filter: serverInfo.playlist[0].musicIsLive ? null : "audioonly",
            liveBuffer: serverInfo.playlist[0].musicIsLive ? 4900 : null,
            highWaterMark: 1<<25,
            dlChunkSize: 0,
        })
        .on('end', ()=>{
            serverInfo.playlist[0].musicEnded = true
        })
    ))
}

module.exports.run = (interaction) => {
    return new Promise(async function (resolve,reject){

        // Getting the server
        let serverInfo = serverInfos.find((elm)=>elm.guildId == interaction.guildId)

        // Connecting to the channel
        if(serverInfo.voiceConnection == null || serverInfo.voiceConnection.state.status === 'disconnected')
        {
            let playConditionsStatus = testPlayConditions(interaction);
            if(playConditionsStatus!=status.ok)
                resolve(playConditionsStatus)
            else
            {
                serverInfo.voiceConnection = joinVoiceChannel({
                    channelId: interaction.member.voice.channel.id,
                    guildId: interaction.guildId,
                    adapterCreator: interaction.guild.voiceAdapterCreator
                }).on('disconnected',()=>{
                    serverInfo.playlist = []
                    if(serverInfo.audioStream != null)
                        serverInfo.audioStream.stop()
                    interaction.channel.send("Goodbye!")
                    serverInfo.voiceConnection.removeAllListeners()
                })
            }
        }

        // Adding the musics
        let result = await youtubeFunctions.getVideoSearch(interaction.options.get("music").value)
        for(let i = 0;i<result.musics.length;i++)
            serverInfo.playlist.push(result.musics[i])
        
        // Intentiating audiostream
        if(serverInfo.audioStream == null)
        {
            serverInfo.audioStream = createAudioPlayer({
                behaviors: {
                    noSubscriber: NoSubscriberBehavior.Stop,
                },
            });
            serverInfo.audioStream
            .on('idle',() => {
                if(!serverInfo.playlist[0].musicEnded) return
                if(serverInfo.isLooping)
                    serverInfo.playlist.push(serverInfo.playlist[0])
                serverInfo.playlist.shift()
                if(serverInfo.playlist.length>0)
                    playSong(serverInfo)
                else
                    serverInfo.voiceConnection.disconnect();
                
            })
            .on('error', e => {
                console.log(e)
                interaction.channel.send("An error occured while playing: "+ serverInfo.playlist[0].musicTitle)
            })
            .on('playing',()=>{
                let embed = new EmbedBuilder()
                    .setColor("Red")
                    .setTitle("Now playing : \n"+serverInfo.playlist[0].musicTitle)
                    .setURL(serverInfo.playlist[0].musicUrl)
                    .setImage(serverInfo.playlist[0].musicThumbnail)
                interaction.channel.send({embeds:[embed]})
            })
        }

        // Subscribing the audioStream
        serverInfo.voiceConnection.subscribe(serverInfo.audioStream)

        // Starting the player if needed
        if(serverInfo.audioStream.state.status === 'idle' || serverInfo.audioStream.state.status === 'autopaused')
            playSong(serverInfo)
        resolve(result.title + " was successfully added to the playlist.")
    })
};

module.exports.help = {
    name: 'play',
    description:'adds the given music by searching for it on youtube to the queue',
    options:[
        {
            "name":"music",
            "description":"the music you want to play",
            "required":true,
            "type":3
        }
    ]
};