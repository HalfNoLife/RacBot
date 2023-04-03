const {EmbedBuilder}  = require('discord.js');
const https = require('https');

module.exports.run = (interaction) => {
    return new Promise(function (resolve){
        const subReddits = ["memes","meirl","historymemes","deepfriedmemes"]
        const titles = ["Here's your meme !","Hahaha good one!\n(I don't really see what's beneath me)","Roses are red, violets are blue, I send memes"]
        let subReddit = subReddits[Math.floor(Math.random() * (subReddits.length-1))]
        let title = titles[Math.floor(Math.random() * (titles.length-1))]
        https.get("https://www.reddit.com/r/"+subReddit+"/hot.json",(res)=>{
            let body = ""
            res.on('data',(chunk)=>{
                body+=chunk
            })
            res.on('end', ()=>{
                let json = JSON.parse(body);
                let meme = json.data.children[Math.floor(Math.random() * (json.data.children.length - 1))].data;
                let embed = new EmbedBuilder()
                    .setColor('#FF5700')
                    .setTitle(title)
                    .setDescription("r/"+subReddit)
                    .setURL("https://www.reddit.com"+meme.permalink)
                    .setImage(meme.url)
                resolve(embed);
            })
        })
    })
}


module.exports.help = {
    name: 'meme',
    description:'sends a meme',
    options:[]
}