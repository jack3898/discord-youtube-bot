/**
 * English language pack for this bot. Create a copy for your language!
 */

const language = {
	// Settings
	numberFormat: 'en-US',

	// General chat messages
	botactive: botname => `Bot logged in as ${botname}!`,
	redisactive: redisport => `Redis server online and listening on port ${redisport}`,
	rediserror: redisport => `Unable to connect to Redis on port ${redisport}. Is it installed and running as a service?`,
	commanderror: () => `There was a problem executing that command.`,
	playing: videotitle => `Playing \`${videotitle}\`!`,
	addedtoqueue: videotitle => `Added \`${videotitle}\` to the queue!`,
	queuetitle: () => `Queue`,
	queuedesc: (page, pages) => `Page ${page} / ${pages}`,
	queueitemtitle: (index, title, author) => `${index}) "${title}" by ${author}`, // When the user types !queue to fetch a list of items in the queue. The list item is this format.
	searchitemtitle: (index, title) => `${index}) ${title}`,
	queueitemdesc: (views, likes, dislikes) => `\`${views}\` views, \`${likes}\` likes, and \`${dislikes}\` dislikes.`,
	searchitemdesc: author => `By ${author}`,
	emptyqueue: () => `The queue is empty.`,
	totalqueuelength: length => `The queue has ${length} item(s) in it.`,
	clearedqueue: () => `Cleared entire queue!`,
	volumeset: percent => `Volume set to \`${percent}%\``,
	currentvolume: percent => `The current volume is set to \`${percent}%\``,
	invoiceorbusy: () => `You are not in a voice channel or I am busy. Try adding something to the queue with \`${config.prefix}add <URL|search>\``,
	popsuccess: () => `Removed the most recent item from the queue.`,
	skipped: () => `Skipped!`,
	skipfail: () => `Could not skip. I am not playing any music!`,
	invalidpage: () => `That is not a valid page!`,
	emptypage: () => `This page is empty.`,
	searchtitle: () => `Which video would you like to add to the queue?`,
	unabletopause: () => `Could not pause. Is something playing?`,
	pausedfortime: minutes => `Paused for ${minutes} minute(s)!`,
	pausedforever: prefix => `Paused. Type \`${prefix}resume\` to resume playback.`,
	unabletoresume: () => `Could not resume. Is there something playing?`,
	resumed: () => `Resumed!`,
	removed: () => `Removed from the queue!`,
	noremovalnumber: () => `Specify the queue item number you want to remove.`,

	// Help command help messages
	helptitle: (page, pageCount) => `Help - page ${page} / ${pageCount}`,
	helpdesc: pageLength => `Get help with this bot. Showing ${pageLength} item(s).`,
	add: prefix => `Add an item to the queue with \`${prefix}add <url|search>\`.`,
	search: prefix => `Search for some videos with \`${prefix}search <search>\`! Will present you with a list of ${config.search_reaction_options.length} results. Use Discord's reaction system to pick the video that suits you.`,
	clear: prefix => `Clear the entire queue with \`${prefix}clear\`. Poof. Gone.`,
	geturl: prefix => `Use a search term to get the first result URL of a YouTube video with \`${prefix}geturl <search>\`.`,
	help: prefix => `You just used this command! You may go to the next page with \`${prefix}help <number>\``,
	play: prefix => `Play a video straight away with \`${prefix}play <URL|search>\`. Do keep in mind that if the bot is already playing something, this will not work. Instead, Add to the queue with \`${prefix}add <url|search>\``,
	playlist: prefix => `Import a playlist and convert it into a queue with \`${prefix}playlist <playlist URL>\`. Will append to an existing queue if there is one. Use \`${prefix}clear\` to clear the queue first should this be a problem.`,
	playlistinqueue: prefix => `All videos have been added to the queue!`,
	pop: prefix => `This will remove the newest item from the queue with \`${prefix}pop\`.`,
	queue: prefix => `Get the current queue with \`${prefix}queue\`.`,
	queuelength: prefix => `Get the length of the queue with \`${prefix}queuelength\`.`,
	skip: prefix => `Skip the current playing song with \`${prefix}skip\`. Or skip to a song later in the queue with \`${prefix}skip <song number>\` which can be identified with \`${prefix}queue <page>\`.`,
	stop: prefix => `Stop the bot from playing and leave the channel with \`${prefix}stop\`.`,
	test: prefix => `Is the bot working? Test it!`,
	urltoinfo: prefix => `Get video information from a given URL with \`${prefix}urltoinfo\`.`,
	volume: prefix => `Change the playing volume of the bot with \`${prefix}volume <percentage>\`.`,
	pause: prefix => `Pause the bot from playing sound with \`${prefix}pause\` or you may set an auto-resume with \`${prefix}pause <minutes>\`.`,
	resume: prefix => `Resume playback from a paused bot with \`${prefix}resume\`.`,
	remove: prefix => `Remove an item from the queue with the queue item number with \`${prefix}remove\`. You can use \`${prefix}queue\` to get a list of numbers.`
};
module.exports = language;
