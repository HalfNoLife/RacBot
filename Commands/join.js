module.exports.run =async (client, message, args) => {
    if (!message.member.voice.channel){
        message.reply("You must be in a voice channel to use this command. If you are in one check its permissions.")
    } else {
    const permissions = message.member.voice.channel.permissionsFor(message.client.user)
        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")){
            message.reply("I need permissions to talk and to connect on the channel you are using.")
        } else {
            message.member.voice.channel.join();
            message.reply("I'm here!")
        }}
};
module.exports.help = {
    name: 'join',
    description:'makes me join your voice channel',
    options:[]
};