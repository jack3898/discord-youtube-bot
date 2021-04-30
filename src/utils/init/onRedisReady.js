function onRedisReady(bot, redis) {
	console.log(__.redisactive(config.redis_port));
	// We only want to run the bot when redis is online and working.
	bot.login(/* Expects environment variable DISCORD_TOKEN */);

	if (config.redis_flush_on_start) {
		if (redis.flushall()) console.log('Redis database flushed - you can turn this off in config.json.');
	}
}

module.exports = onRedisReady;
