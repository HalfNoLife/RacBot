module.exports = async(client) => {

    client.user.setPresence({
        activity: {
            name: "type !help",
            type: "LISTENING"
            
        }
    })
};