module.exports.run =async (client, message, args) => {
const play = require ("./play");
for (i=0;i<play.length;i++){
    if(message.guild.id==play[i].key){
        found = true
        if(args[0]==undefined||args[0]==1){
            message.reply(play[i].value.queue[0].MusicTitle+" was succesfully removed from the paylist")
            play[i].value.queue.splice(0,1)
        } else if ((Number.isInteger(parseInt(args[0])))&&(parseInt(args[0])>1)&&(parseInt(args[0])<=play[i].value.queue.length)){
            message.reply(play[i].value.queue[parseInt(args[0])-1].MusicTitle+" was succesfully removed from the paylist")
            play[i].value.queue.splice(args[0]-1,1)
        } else {
            message.channel.send("Please specify a number between 1 and "+(play[i].value.queue.length)+".")
    }}
}
};
module.exports.help = {
    name: 'remove'
};