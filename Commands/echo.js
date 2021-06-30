module.exports.run =async (client, message, args) => {
    str=""
    for(i=0;i<message.content.length-6;i++){
        str+=message.content[i+6]
    }
    message.channel.send(str)
};
module.exports.help = {
    name: 'echo',
    description:'repeats the message'
};