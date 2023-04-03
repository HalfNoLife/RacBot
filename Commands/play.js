const serverInfos = require("../serverInfos").ServerInfos
const youtubeFunctions = require("../youtubeFunctions")
const status = require("../status")
const { joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior, VoiceConnectionStatus } = require('@discordjs/voice');
const ytdl = require("ytdl-core");
const { EmbedBuilder } = require("discord.js");

const config = require("../config.json")

function testPlayConditions(interaction) {
    console.log(interaction.member.voice.channel)
    if(interaction.member.voice.channel == null)
        return status.notInVoiceChannel;
    else if(!interaction.member.voice.channel.permissionsFor(interaction.client.user).has("CONNECT"))
        return status.connectPermissionError;
    else if(!interaction.member.voice.channel.permissionsFor(interaction.client.user).has("SPEAK"))
        return status.speakPermissionError;
    else
        return status.ok;
}

async function player(serverInfo)
{
    serverInfo.audioStream.play(createAudioResource(ytdl(serverInfo.playlist[0].musicUrl+"&bpctr=9999999999&has_verified=1",
    {
        filter:serverInfo.playlist[0].musicIsLive ? null : "audioonly",
        highWaterMark:1<<25,
        maxReconnect:5,
        quality:serverInfo.playlist[0].musicIsLive ? "91" : "140",
        requestOptions:{
            headers:{
                'cookie':config.ytcookie,
                'x-youtube-identity-token':config.ytidtoken,
            }
        }
    })))
    let embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("Now playing : \n"+serverInfo.playlist[0].musicTitle)
        .setURL(serverInfo.playlist[0].musicUrl)
        .setImage(serverInfo.playlist[0].musicThumbnail)
    serverInfo.textChannel.send({
        embeds:[embed]
    })
    serverInfo.audioStream
    .on('idle',()=>{
        console.log("music ended")
        if(serverInfo.isLooping)
            serverInfo.playlist.push(serverInfo.playlist[0])
        serverInfo.playlist.shift()
        if(serverInfo.playlist.length>0)
            player(serverInfo)
    })
    .on('error', e => {
        console.log(e)
    })
}

module.exports.run = (interaction) => {
    return new Promise(async function (resolve,reject){
        let serverInfo = serverInfos.find((elm)=>elm.guildId == interaction.guildId)
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
                })
            }
        }
        let result = await youtubeFunctions.getVideoSearch(interaction.options.get("music").value)
        for(let i = 0;i<result.musics.length;i++)
            serverInfo.playlist.push(result.musics[i])
        if(serverInfo.audioStream == null)
        {
            serverInfo.audioStream = createAudioPlayer({
                behaviors: {
                    noSubscriber: NoSubscriberBehavior.Pause,
                },
            });
            serverInfo.voiceConnection.subscribe(serverInfo.audioStream)
        }
        console.log(serverInfo.audioStream.state.status)
        serverInfo.textChannel = interaction.channel
        if(serverInfo.audioStream.state.status === 'idle' || serverInfo.audioStream.state.status === 'autopaused')
            player(serverInfo)
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