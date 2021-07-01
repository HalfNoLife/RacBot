module.exports.run =async (client, message, args) => {
    const play = require ("./play");
    for (i=0;i<play.length;i++){
        if (message.guild.id==play[i].key){
            play[i].value.queue=[]
            play[i].value.channel.send("Queue destroyed!")
        };
    };
};
module.exports.help = {
    name: 'destroy',
    description:'destroys the current music queue',
    options:[]
};