module.exports.run =async (client, message, args) => {
const play=require("./play");
var found = false;
for (i=0;i<play.length;i++){
    if (message.guild.id==play[i].key){
        var found = true;
        play[i].value.loop=!play[i].value.loop;
        if(play[i].value.loop){
            loopInfo="Current Playlist is now looping"
        } else {
            loopInfo="Current Playlist is now not looping"
        }
    }
}
if(!found){
    message.reply("I do not have any playlist to loop on this server")
}
if (args[0]!=undefined){
    loopInfo= loopInfo+"\nNote that this command doesn't require any argument."
}
message.channel.send(loopInfo)
}
module.exports.help = {
    name: 'loop',
    description:'loops the current music queue'
};