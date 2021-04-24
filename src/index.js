global.config = require('./../config.json');
global.srcPath = __dirname;

// Discord dependencies
const Discord = require('discord.js');
const bot = new Discord.Client();

// Redis database & cache
const redisModule = require('redis');
const redis = redisModule.createClient(config.redis_port);

// Custom utils
const commandProcessor = require('./utils/commandProcessor');
const getFileList = require('./utils/getFileList');
const getModuleCollection = require('./utils/getModuleCollection');

redis.on('ready', () => {
	console.log(`Redis server online and listening on port ${config.redis_port}.`);
	// We only want to run the bot when redis is online and working.
	bot.login(/* Expects environment variable DISCORD_TOKEN */);
});

bot.on('ready', () => {
	console.log(`Bot logged in as ${bot.user.username}!`);

	const commandModules = getFileList('commands');
	bot.commands = getModuleCollection(commandModules, 'commands');
});

// On command
bot.on('message', msg => {
	if (msg.author.bot || !msg.content.startsWith(config.prefix)) return;
	const command = new commandProcessor(msg);
	if (bot.commands.has(command.cmd)) bot.commands.get(command.cmd)(bot, msg, command);
});
