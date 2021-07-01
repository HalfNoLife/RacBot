module.exports.run =async (client, message, args) => {
    const play = require ("./play");
    for (i=0;i<play.length;i++){
        if (message.guild.id==play[i].key){
            play[i].value.dispatcher.end()
            play[i].value.queue = []
            play[i].value.CurrentSong = null
            play[i].value.voiceConnection.disconnect()
            play[i].value.channel.send("See you!")
        };
    };
};
module.exports.help = {
    name: 'leave',
    description:'leaves the voice channel',
    options:[]
};