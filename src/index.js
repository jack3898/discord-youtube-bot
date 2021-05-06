// Some cheeky global values
global.config = require('./../config.json');
global.srcPath = __dirname;
global.__ = require(`./lang/${config.language}`);

// Discord API library
const {Client} = require('discord.js');
const bot = new Client();

// Redis database & cache library
const redisModule = require('redis');
const redis = redisModule.createClient(config.redis_port);

// Init functions
const {onRedisReady, onRedisError, onBotReady, onMessage} = require('./utils/functions/eventHandlers');

// Wait for Redis to run
redis.on('ready', () => onRedisReady(bot, redis));

// If a connection to Redis cannot be established, stop the bot
redis.on('error', onRedisError);

// Initialise the bot!
bot.on('ready', () => onBotReady(bot));

// On command
bot.on('message', msg => onMessage(bot, msg));
