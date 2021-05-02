/**
 * English language pack for this bot. Create a copy for your language!
 */

const language = {
	botactive: botname => `Bot logged in as ${botname}!`,
	redisactive: redisport => `Redis server online and listening on port ${redisport}`,
	rediserror: redisport => `Unable to connect to Redis on port ${redisport}. Is it installed and running as a service?`,
	commanderror: () => `There was a problem executing that command.`,
	playing: videotitle => `Playing \`${videotitle}\`!`,
	addedtoqueue: videotitle => `Added \`${videotitle}\` to the queue!`,
	queueitem: (item, index) => `${index + 1}) \`${item}\``, // When the user types !queue to fetch a list of items in the queue. The list item is this format.
	clearedqueue: () => `Cleared entire queue!`,
	volumeset: percent => `Volume set to \`${percent}%\``,
	currentvolume: percent => `The current volume is set to \`${percent}%\``,
	invoiceorbusy: () => `You are not in a voice channel or I am busy. Try adding something to the queue with \`${config.prefix}add <URL|search>\``,
	popsuccess: () => `Removed the most recent item from the queue.`,
	emptyqueue: () => `The queue is empty.`,
	skipped: () => `Skipped!`,
	invalidpage: () => `That is not a valid page!`,
	emptypage: () => `This page is empty.`,

	// Help command help messages
	add: prefix => `Add an item to the queue with \`${prefix}add <url|search>\`.`,
	clear: prefix => `Clear the entire queue with \`${prefix}clear\`. Poof. Gone.`,
	geturl: prefix => `Use a search term to get the first result URL of a YouTube video with \`${prefix}geturl <search>\`.`,
	help: prefix => `You just used this command! You may go to the next page with \`${prefix}help <number>\``,
	play: prefix => `Play a video straight away with \`${prefix}play <URL|search>\`. Do keep in mind that if the bot is already playing something, this will not work. Instead, Add to the queue with \`${prefix}add <url|search>\``,
	pop: prefix => `This will remove the newest item from the queue with \`${prefix}pop\`.`,
	queue: prefix => `Get the current queue with \`${prefix}queue\`.`,
	queuelength: prefix => `Get the length of the queue with \`${prefix}queuelength\`.`,
	skip: prefix => `Skip the current playing song with \`${prefix}skip\`.`,
	stop: prefix => `Stop the bot from playing and leave the channel with \`${prefix}stop\`.`,
	test: prefix => `Is the bot working? Test it!`,
	urltoinfo: prefix => `Get video information from a given URL with \`${prefix}urltiinfo\`.`,
	volume: prefix => `Change the playing volume of the bot with \`${prefix}volume <percentage>\`.`
};

module.exports = language;
