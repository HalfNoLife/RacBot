const randomPuppy = require('random-puppy');
const Discord = require('discord.js');
const { Attachment, RichEmbed } = require('discord.js');

module.exports.run = (client, message, args) => {
const SubReddits = ["memes","dankmemes","meirl","historymemes","deepfriedmemes"]
const Titles = ["Here's your meme !","Not funny? It's reddit fault otherwise you can thank me.","Hahaha good one!\n(I don't really see what's beneath me)","Roses are red, violets are blue, I send memes"]
var SubReddit = SubReddits[Math.floor(Math.random() * (SubReddits.length-1))]
var Title = Titles[Math.floor(Math.random() * (Titles.length-1))]
var randomColor = '#'+Math.floor(Math.random()*16777215).toString(16);
randomPuppy(SubReddit)
    .then(url => {
        const meme = new Discord.MessageEmbed()
		meme.setColor(randomColor)
        meme.setTitle(Title)
        meme.setDescription("Not funny ? It's from: r/"+SubReddit+".\nYou can report this to my creator(HalfNoLife#2347) so he can fix this.")
		meme.setURL(url)
        meme.setImage(url)
        if ((url.endsWith(".jpg") || url.endsWith(".png") || url.endsWith(".gif"))){
            message.channel.send(meme)}
        else {
            message.channel.send(Title+"\n"+ url+"\nNot funny ? It's from: r/"+SubReddit+".\nYou can report this to my creator(HalfNoLife#2347) so he can fix this.")}
    })

}
module.exports.help = {
    name: 'meme',
    description:'sends a meme',
    options:[]
}