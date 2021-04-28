global.config = require('./../config.json');
global.srcPath = __dirname;

// Discord dependencies
const Discord = require('discord.js');
const bot = new Discord.Client();

// Redis database & cache
const redisModule = require('redis');
const redis = redisModule.createClient(config.redis_port);

// Custom utils
const CommandProcessor = require('./utils/CommandProcessor');
const getFileList = require('./utils/getFileList');
const getModuleCollection = require('./utils/getModuleCollection');

// Language
global.__ = require(`./lang/${config.language}`);

// Wait for Redis to run
redis.on('ready', () => {
	console.log(__.redisactive(config.redis_port));
	// We only want to run the bot when redis is online and working.
	bot.login(/* Expects environment variable DISCORD_TOKEN */);

	redis.flushall();
});

// If a connection to Redis cannot be established, stop the bot
redis.on('error', () => {
	throw Error(__.rediserror(config.redis_port));
});

// Initialise the bot!
bot.on('ready', () => {
	console.log(__.botactive(bot.user.username));

	const commandModules = getFileList('commands');

	bot.commands = getModuleCollection(commandModules, 'commands');
	bot.players = new Discord.Collection(); // This stores one Player instance per guild, which controls music playback. use GetPlayers in /utils to get these instances.
});

// On command
bot.on('message', msg => {
	if (msg.author.bot || !msg.content.startsWith(config.prefix)) return;
	const command = new CommandProcessor(msg);
	if (bot.commands.has(command.cmd)) bot.commands.get(command.cmd)(bot, msg, command);
});
