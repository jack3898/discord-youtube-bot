// You may think me adding globals is being naughty, but I am aware of the risks and believe this is the way to go.
global.config = require('./../config.json');
const redisModule = require('redis');
const redis = redisModule.createClient(config.redis_port);
global.Discord = require('discord.js');
global.bot = new Discord.Client();

const commandProcessor = require('./utils/commandProcessor');

redis.on('ready', () => {
	console.log(`Redis server online and listening on port ${config.redis_port}.`);
	// We only want to run the bot when redis is online.
	bot.login(/* Expects environment variable DISCORD_TOKEN */);
});

bot.on('ready', () => {
	console.log(`Bot logged in as ${bot.user.username}!`);
});

// On command
bot.on('message', msg => {
	if (msg.author.bot || !msg.content.startsWith(config.prefix)) return;

	const command = new commandProcessor(msg);

	console.log(command.args);
});
