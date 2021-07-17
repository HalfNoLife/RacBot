const format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
module.exports.run =async (client, channel, authorID, args) => {
    const ServerInfos = require("../ServerInfos").ServerInfos
    return new Promise(function (resolve,reject){
        for (let i=0;i<ServerInfos.length;i++){
            if (channel.guild.id==ServerInfos[i].ID){
                if(format.test(args[0])){
                    ServerInfos[i].Prefix = args[0]
                    resolve("new prefix set to "+args[0])
                } else {
                    resolve("The given prefix contains invalid characters")
                }
            };
        };
    })
};
module.exports.help = {
    name: 'prefix',
    description:'sets the prefix for your server',
    options:[{
        "name":"prefix",
        "description":"the prefix you want to use",
        "required":true,
        "type":3
    }]
};

function testFormat(string){
    return
}