const getPlayer = require('./../utils/functions/getPlayer');
const getVideoDetails = require('./../utils/functions/getVideoDetails');

module.exports = {
	name: 'queue',
	description: __.queue(config.prefix),
	action: async (bot, msg, command) => {
		try {
			const page = command.args[0] || 1;
			const queue = getPlayer(msg.guild, bot);
			const result = await queue.get(page);

			if (result.queue.length === 0) {
				msg.channel.send(__.emptyqueue());
				return;
			}

			// Gather all video details. As it is async, the array will be a list of promises.
			const videos = result.queue.map(async url => {
				const details = await getVideoDetails(url);

				if (details) return details.videoDetails.title;
				return url;
			});

			// Wait for all promises to fulfill
			const resolvedVideos = await Promise.all(videos);

			// Construct the list!
			const reply = resolvedVideos.map((item, index) => __.queueitem(item, index + result.startsFrom)).join('\n');

			msg.channel.send(reply);
		} catch (error) {
			console.error(error);
			msg.channel.send(__.commanderror());
		}
	}
};
