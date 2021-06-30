module.exports.run =async (client, message, args) => {
const play = require("./play")
var found=false
    for (i=0;i<play.length;i++){
        if(message.guild.id==play[i].key){
            found = true
            if (play[i].value.CurrentSong!=null){
                message.reply(play[i].value.CurrentSong.MusicTitle+" was succesfully skipped.")
            } else {
                message.reply("Sorry but their is no songs to skip for now on this server.")
            }
            play[i].value.dispatcher.end()
            
        } 
    }
if (!found){
    message.channel.send("Sorry but it seems you haven't created any playlist yet")
}
};
module.exports.help = {
    name: 'skip',
    description:'skips the current music in the queue'
};