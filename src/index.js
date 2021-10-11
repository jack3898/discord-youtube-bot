// Some cheeky global values
import { Client } from 'discord.js';
import { config as env } from 'dotenv';
import redisModule from 'redis';
import conf from './../config.js';
import lang from './lang/en.js';
// Init functions
import { onBotReady, onMessage, onRedisError, onRedisReady } from './utils/functions/eventHandlers.js';

env();

global.config = conf;
global.__ = lang;

const bot = new Client();

// Redis database & cache library
const redis = redisModule.createClient(config.redis_port, config.redis_host);

// Wait for Redis to run
redis.on('ready', () => onRedisReady(bot, redis));

// If a connection to Redis cannot be established, stop the bot
redis.on('error', onRedisError);

// Initialise the bot!
bot.on('ready', () => onBotReady(bot));

// On command
bot.on('message', msg => onMessage(bot, msg));
