// Some cheeky global values
import {Client} from 'discord.js';
import conf from './../config.js';
import lang from './lang/en.js';
import redisModule from 'redis';

global.config = conf;
global.__ = lang;

const bot = new Client();

// Redis database & cache library
const redis = redisModule.createClient(config.redis_port);

// Init functions
import {onRedisReady, onRedisError, onBotReady, onMessage} from './utils/functions/eventHandlers.js';

// Wait for Redis to run
redis.on('ready', () => onRedisReady(bot, redis));

// If a connection to Redis cannot be established, stop the bot
redis.on('error', onRedisError);

// Initialise the bot!
bot.on('ready', () => onBotReady(bot));

// On command
bot.on('message', msg => onMessage(bot, msg));
