function onRedisError(err) {
	console.error(err);
	throw Error(__.rediserror(config.redis_port));
}

module.exports = onRedisError;
