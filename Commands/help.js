module.exports.run = (client, channelID, authorID, args) => {
    return new Promise(function (resolve, reject){
        const message = "!help --- gives you the different commands syntax\n" +
            "!ping --- Pings the bot\n!leave --- disconnects me from your voice channel\n" +
            "!join --- makes me join your voice channel\n" +
            "!play + <key-words>/<Youtube-playlist-url>/<Youtube-video-url> --- plays the music you searched for/adds it to the queue\n" +
            "!skip --- skips the current music in the playlist \n" +
            "!pause & !resume --- pauses/resumes the current music in the queue\n" +
            "!destroy --- destroys the current music queue\n" +
            "!loop --- loops the current music queue or not\n" +
            "!remove <X> --- removes the specified music depending on it's place in the queue'\n" +
            "!queue --- displays the current music queue informations\n" +
            "!shuffle --- shuffles the current music queue\n" +
            "!relationship --- asks you if you want to mary another random user\n" +
            "!howsmart +<@user>/<text> --- tells you the mentioned user/thing in text iq\n" +
            "!meme --- Sends a meme from reddit\n" +
            "!weather +<city-name> --- Gives you the weather for the specified city \n" +
            "!dadjoke --- Sends a dadjoke" +
            "!echo <text>--- resends the specified text"
        //client.channels.cache.get(channelID).send(message)
        resolve(message)
    })
};

module.exports.help = {
    name: 'help',
    description:'gives detailed information about commands usage',
    options:[]
};