const http = require("https")
const config = require("../config.json")
module.exports.run =async (client, message, args) => {
    console.log()
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
            message.channel.send(json.body[0].setup)
            setTimeout(() => {  message.channel.send(json.body[0].punchline); }, 5000);
        });
    });
    req.end();
};
module.exports.help = {
    name: 'dadjoke',
    description:'sends a dad joke'
};