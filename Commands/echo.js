module.exports.run =async (client, channelID, authorID, args) => {
    return new Promise(function (resolve,reject){
        console.log(args)
        str=""
        for(var i=0;i<args.length;i++){
            for(var y=0;y<args[i].length;y++){
                str+=args[i][y]
            }
            str+=" "
        }
        console.log(str)
        resolve(str)
    })
};
module.exports.help = {
    name: 'echo',
    description:'repeats the message',
    options:[{
        "name":"message",
        "description":"the message to repeat",
        "required":false,
        "type":3
    }]
};