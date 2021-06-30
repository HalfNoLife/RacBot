module.exports.run =async (client, message, args) => {
    const play = require ("./play");
    for (i=0;i<play.length;i++){
        if (message.guild.id==play[i].key){
            shuffle(play[i].value.queue)
            message.channel.send("shuffled")
        };
    };
};
module.exports.help = {
    name: 'shuffle',
    description:'shuffles the server music queue'
};

function shuffle(arr){
    for(i=0;i<arr.length;i++){
        j=Math.floor(Math.random() * arr.length);
        mem = arr[j]
        arr[j] = arr[i]
        arr[i] = mem
    }
    return arr
}