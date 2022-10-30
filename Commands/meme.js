const Discord = require('discord.js');
const https = require('https');

module.exports.run = (client, channel, authorID, args) => {
    return new Promise(function (resolve,reject){
        const SubReddits = ["memes","meirl","historymemes","deepfriedmemes"]
        const Titles = ["Here's your meme !","Hahaha good one!\n(I don't really see what's beneath me)","Roses are red, violets are blue, I send memes"]
        let SubReddit = SubReddits[Math.floor(Math.random() * (SubReddits.length-1))]
        let Title = Titles[Math.floor(Math.random() * (Titles.length-1))]
        let randomColor = '#'+Math.floor(Math.random()*16777215).toString(16);
        https.get("https://www.reddit.com/r/"+SubReddit+"/hot.json",(res)=>{
            let body = ""
            res.on('data',(chunk)=>{
                body+=chunk
            })
            res.on('end', ()=>{
                let json = JSON.parse(body);
                let meme = json.data.children[Math.floor(Math.random() * (json.data.children.length - 1))].data;
                let embed = new Discord.MessageEmbed();
                embed.setColor(meme.link_flair_background_color);
                embed.setTitle(Title);
                embed.setDescription("r/"+SubReddit);
                embed.setURL("https://www.reddit.com"+meme.permalink);
                embed.setImage(meme.url);
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