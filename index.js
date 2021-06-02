const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("./config.json")
const fs=require('fs');
client.login(config.token);
client.commands = new Discord.Collection();
console.log("Online!")
fs.readdir("./Commandes/",(error, f) =>{
    if(error) console.log(error);
    
    let commandes = f.filter(f => f.split(".").pop() === "js");
    if(commandes.length <=0) return console.log("No commandes found !")
    
    commandes.forEach((f) => {
        let commande = require(`./Commandes/${f}`);
        client.commands.set(commande.help.name, commande);
    });
});


fs.readdir("./Events/", (error, f) => {
    if(error) console.log(error);

    f.forEach((f)=>{
        const events = require(`./Events/${f}`);
        const event = f.split(".")[0];
        client.on(event, events.bind(null, client));
    });
});
