const client = require("./index")
const config = require("./config.json")
const ytdl = require("ytdl-core");
const status = require("./status")
const ServerInfos = []


class ServerInfo {
    guildId
    playlist
    voiceConnection
    isLooping
    audioStream
    textChannel
    constructor(guildId) {
        this.guildId = guildId;
        this.playlist = [];
        this.isLooping = false;
        this.AudioStream = null;
        this.textChannel = null;
        ServerInfos.push(this)
    }
}
module.exports = {ServerInfos,ServerInfo};