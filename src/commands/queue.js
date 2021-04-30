const getPlayer = require('./../utils/functions/getPlayer');
const getVideoDetails = require('./../utils/functions/getVideoDetails');

const command = {
	name: 'queue',
	action: async (bot, msg) => {
		try {
			const queue = getPlayer(msg.guild, bot);
			const result = await queue.get();

			if (result.length === 0) {
				msg.channel.send(__.emptyqueue());
				return;
			}

			// Gather all video details. As it is async, the array will be a list of promises.
			const videos = result.map(async url => {
				const details = await getVideoDetails(url);

				if (details) return details.videoDetails.title;
				return url;
			});

			// Wait for all promises to fulfill
			const resolvedVideos = await Promise.all(videos);

			// Construct the list!
			const reply = resolvedVideos.map(__.queueitem).join('\n');

			msg.channel.send(reply);
		} catch (error) {
			console.error(error);
			msg.channel.send(__.commanderror());
		}
	}
};

module.exports = command;
