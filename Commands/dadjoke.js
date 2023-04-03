const http = require("https")
const config = require("../config.json")
module.exports.run = (interaction) => {
    return new Promise(function (resolve){
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
            let body = "";

            res.on("data", (chunk) => {
                body+=chunk;
            });

            res.on("end", () => {
                let json = JSON.parse(body)
                setTimeout(() => { interaction.channel.send(json.body[0].punchline); }, 5000);
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