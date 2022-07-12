module.exports = async(client) => {
    setInterval(()=>{
        client.user.setActivity(`Present in ${client.guilds.cache.size} servers`)
    },60*1000);
};