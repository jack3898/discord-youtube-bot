const {Collection} = require('discord.js');
const CommandProcessor = require('./../classes/CommandProcessor');
const {getFileList, getModuleCollection} = require('./getHandlers');

/**
 * THIS EVENT HANDLER FILE PROVIDES MULTIPLE INDEPENDENT UTILITY FUNCTIONS FOR HANDLING EVENTS
 */

/**
 * What the bot should do when it detects a message.
 * @param {Discord.Client} bot
 * @param {Discord.Message} msg
 * @returns
 */
function onMessage(bot, msg) {
	if (msg.author.bot || !msg.content.startsWith(config.prefix)) return;
	const command = new CommandProcessor(msg);
	if (bot.commands.has(command.cmd)) bot.commands.get(command.cmd).action(bot, msg, command);
}

/**
 * What to do when the bot has successfully authenticated with the Discord API.
 * @param {Client} bot
 */
function onBotReady(bot) {
	console.log(__.botactive(bot.user.username));

	const commandModules = getFileList('commands');

	bot.commands = getModuleCollection(commandModules, 'commands');
	bot.players = new Collection(); // This stores one Player instance per guild, which controls music playback. use GetPlayers in /utils to get these instances.
}

/**
 * Redis could not establish a connection to the local server.
 * @param {Error} err
 */
function onRedisError(err) {
	console.error(err);
	throw Error(__.rediserror(config.redis_port));
}

/**
 * What to do when Redis is ready and connected.
 * @param {Discord.Client} bot
 * @param {*} redis
 */
function onRedisReady(bot, redis) {
	console.log(__.redisactive(config.redis_port));
	// We only want to run the bot when redis is online and working.
	bot.login(/* Expects environment variable DISCORD_TOKEN */);

	if (config.redis_flush_on_start) {
		if (redis.flushall()) console.log('Redis database flushed - you can turn this off in config.json.');
	}
}

exports.onMessage = onMessage;
exports.onBotReady = onBotReady;
exports.onRedisError = onRedisError;
exports.onRedisReady = onRedisReady;
