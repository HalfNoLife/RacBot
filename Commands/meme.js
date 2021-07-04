const randomPuppy = require('random-puppy');
const Discord = require('discord.js');

module.exports.run = (client, channel, authorID, args) => {
    return new Promise(function (resolve,reject){
        const SubReddits = ["memes","meirl","historymemes","deepfriedmemes"]
        const Titles = ["Here's your meme !","Hahaha good one!\n(I don't really see what's beneath me)","Roses are red, violets are blue, I send memes"]
        var SubReddit = SubReddits[Math.floor(Math.random() * (SubReddits.length-1))]
        var Title = Titles[Math.floor(Math.random() * (Titles.length-1))]
        var randomColor = '#'+Math.floor(Math.random()*16777215).toString(16);
        console.log("Trying to get meme...")
        randomPuppy(SubReddit)
            .then(url => {
                const meme = new Discord.MessageEmbed()
                meme.setColor(randomColor)
                meme.setTitle(Title)
                meme.setDescription("r/"+SubReddit)
                meme.setURL(url)
                meme.setImage(url)
                console.log(meme)
                if ((url.endsWith(".jpg") || url.endsWith(".png") || url.endsWith(".gif"))){
                    resolve(meme)}
                else {
                    resolve(Title+"\n"+ url+"\nr/"+SubReddit)}
            })
    })
}
module.exports.help = {
    name: 'meme',
    description:'sends a meme',
    options:[]
}