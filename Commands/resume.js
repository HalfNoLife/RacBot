module.exports.run =async (client, message, args) => {
    const play = require ("./play");
    for (i=0;i<play.length;i++){
        if (message.guild.id==play[i].key){
            play[i].value.dispatcher.resume()
            play[i].value.channel.send("Music resumed!")
        };
    };
};
module.exports.help = {
    name: 'resume',
    description:'resumes the music',
    options:[]
};