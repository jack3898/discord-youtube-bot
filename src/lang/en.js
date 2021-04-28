/**
 * English language pack for this bot. Create a copy for your language!
 */

const language = {
	botactive: botname => `Bot logged in as ${botname}!`,
	redisactive: redisport => `Redis server online and listening on port ${redisport}`,
	rediserror: redisport => `Unable to connect to Redis on port ${redisport}. Is it installed and running as a service?`,
	addedtoqueue: () => `Added item to the queue!`,
	invoiceorbusy: () => `You are not in a voice channel or I am busy.`,
	popsuccess: () => `Removed the most recent item from the queue.`,
	emptyqueue: () => `The queue is empty.`,
	skipped: () => `Skipped!`
};

module.exports = language;
