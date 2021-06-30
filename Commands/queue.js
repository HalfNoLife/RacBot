module.exports.run =async (client, message, args) => {
    const play = require ("./play");
    found=false;
    for (i=0;i<play.length;i++){
        if((message.guild.id==play[i].key)&&(play[i].value.queue.length>0)){
            found=true;
            var queueInfos ="Your current server Music Queue is:\n";
            for(q=0;q<play[i].value.queue.length;q++){
                queueInfos=queueInfos+(q+1)+": "+play[i].value.queue[q].MusicTitle+"\n"
                if(queueInfos.length>1500){
                    message.channel.send(queueInfos)
                    queueInfos=""
                }
            }
            if(play[i].value.loop){
                queueInfos=queueInfos+("And the playlist is currently looping")
            } else {
                queueInfos=queueInfos+("And the playlist is currently not looping")
            }
        }
    }
    if (!found){
        message.channel.send("sorry but it seems like no playlist are currently running on your server")
    } else {
        message.channel.send(queueInfos);
    }
};

    module.exports.help = {
        name: 'queue',
        description:'sends information about the server music queue'
    };