module.exports.run =async (interaction) => {
    return new Promise(function (resolve,reject){
        if(interaction.options.get("message") == null)
            resolve("**Silent Noises**")
        else
            resolve(interaction.options.get("message").value)
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