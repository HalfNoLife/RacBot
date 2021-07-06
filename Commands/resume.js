module.exports.run =async (client, channel, authorID, args) => {
    const ServerInfos = require("../ServerInfos").ServerInfos
    return new Promise(function (resolve, reject){
        for (let i=0;i<ServerInfos.length;i++){
            if (ServerInfos[i].ID==channel.guild.id && ServerInfos[i].AudioStream != null){
                ServerInfos[i].AudioStream.resume()
                resolve("Music resumed")
            };
        };
    })
};
module.exports.help = {
    name: 'resume',
    description:'resumes the music',
    options:[]
};