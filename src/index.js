global.Discord = require('discord.js');
global.bot = new Discord.Client();

bot.on('ready', () => {
	console.log(`Bot logged in as ${bot.user.username}!`);
});

bot.login(/* Expects DISCORD_TOKEN */);
