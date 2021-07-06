const http = require("https")
const config = require("../config.json")
var message = "";
module.exports.run =(client, channel, authorID, args) => {
    return new Promise(function (resolve, reject){
        const options = {
            "method": "GET",
            "hostname": "dad-jokes.p.rapidapi.com",
            "port": null,
            "path": "/random/joke",
            "headers": {
                "x-rapidapi-key": config.dadjokekey,
                "x-rapidapi-host": "dad-jokes.p.rapidapi.com",
                "useQueryString": true
            }
        };
        const req = http.request(options, function (res) {
            const chunks = [];

            res.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res.on("end", function () {
                const body = Buffer.concat(chunks);
                let json = JSON.parse(body)
                setTimeout(() => {  client.channels.cache.get(channelID).send(json.body[0].punchline); }, 5000);
                resolve(json.body[0].setup)
            });
        });
        req.end();
    })
};
module.exports.help = {
    name: 'dadjoke',
    description:'sends a dad joke',
    options:[]
};