const https = require("https")
const config = require("../config.json")
module.exports.run =async (client, channel, authorID, args) => {
    return new Promise((resolve, reject)=>{
        if(toURLFormat(args)==""){
            channel.send("You need to specify a place you want weather previsions for")
        } else {
            resolve(getContent("https://api.openweathermap.org/data/2.5/weather?q="+toURLFormat(args)+"&appid="+config.weatherAPIkey,channel,toWrittenFormat(args)))
        }
    })

};
function getContent(url,channel,cityName){
    return new Promise(((resolve, reject) => {
        https.get(url,(res) => {
            let body = "";

            res.on("data", (chunk) => {
                body += chunk;
            });
            res.on("end", () => {
                try {
                    let json = JSON.parse(body);
                    if(json.cod==200){
                        resolve("The weather in "+cityName+" is: "+json.weather[0].description+"" +
                            "\nThe temperature is: "+(json.main.temp-273.15).toPrecision(2)+"°C"+
                            "\nThe humidity is of: "+(json.main.humidity)+"%")
                    } else {
                        resolve(json.message)
                    }
                } catch (error) {
                    console.error(error.message);
                };
            });

        }).on("error", (error) => {
            console.error(error.message);
        });
    }))

}

function toURLFormat(args){
    subString = args.join("%20")
    str = ""
    for(i=0;i<subString.length && subString[i]!="&";i++){
        str+=subString[i]
    }
    return str
}
function toWrittenFormat(args){
    subString = args.join(" ")
    str = ""
    for(i=0;i<subString.length && subString[i]!="&";i++){
        str+=subString[i]
    }
    return str
}

module.exports.help = {
    name: 'weather',
    description:'sends the weather in the specified town',
    options:[{
        "name":"town",
        "description":"The name of the town where you want the weather",
        "required":true,
        "type":3
    }]
};