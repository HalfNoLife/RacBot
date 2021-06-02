module.exports.run =async (client, message, args) => {
const play=require("./play")
for (i=0;i<play.length;i++){
    if (message.guild.id==play[i].key){
        play[i].value.loop=!play[i].value.loop;
        if(play[i].value.loop){
            loopInfo="Current Playlist is now looping"
        } else {
            loopInfo="Current Playlist is now not looping"
        }
    }
}
if (args[0]!=undefined){
    loopInfo= loopInfo+"\nNote that this command doesn't require any argument."
}
message.channel.send(loopInfo)
}
module.exports.help = {
    name: 'loop'
};