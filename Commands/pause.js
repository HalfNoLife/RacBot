module.exports.run =async (client, message, args) => {
    const play = require ("./play");
    for (i=0;i<play.length;i++){
        if (message.guild.id==play[i].key){
            play[i].value.dispatcher.pause()
            play[i].value.channel.send("Music paused!")
        };
    };
};
module.exports.help = {
    name: 'pause',
    description:'pauses the music',
    options:[]
};