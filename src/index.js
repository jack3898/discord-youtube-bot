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
const onRedisReady = require('./utils/init/onRedisReady');
const onRedisError = require('./utils/init/onRedisError');
const onBotReady = require('./utils/init/onBotReady');
const onMessage = require('./utils/functions/onMessage');

// Wait for Redis to run
redis.on('ready', () => onRedisReady(bot, redis));

// If a connection to Redis cannot be established, stop the bot
redis.on('error', onRedisError);

// Initialise the bot!
bot.on('ready', () => onBotReady(bot));

// On command
bot.on('message', msg => onMessage(bot, msg));
