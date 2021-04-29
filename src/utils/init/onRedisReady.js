function onRedisReady(bot, redis) {
	console.log(__.redisactive(config.redis_port));
	// We only want to run the bot when redis is online and working.
	bot.login(/* Expects environment variable DISCORD_TOKEN */);

	redis.flushall();
}

module.exports = onRedisReady;
