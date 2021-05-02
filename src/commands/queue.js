const {MessageEmbed} = require('discord.js');
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

				if (details) return details.videoDetails;
				return url;
			});

			// Wait for all promises to fulfill
			const resolvedVideos = await Promise.all(videos);
			const numberFormat = new Intl.NumberFormat(__.numberFormat);

			const embedFields = resolvedVideos.map((video, index) => {
				const views = numberFormat.format(video.viewCount);
				const likes = numberFormat.format(video.likes);
				const dislikes = numberFormat.format(video.dislikes);

				return {
					name: __.queueitemtitle(index + result.startsFrom + 1, video.title, video.author.name),
					value: __.queueitemdesc(views, likes, dislikes)
				};
			});

			const reply = new MessageEmbed()
				.setColor(config.success_colour)
				.setTitle(__.queuetitle())
				.setDescription(__.queuedesc(result.page, result.pages))
				.addFields(...embedFields);

			// Construct the list!

			msg.channel.send(reply);
		} catch (error) {
			console.error(error);
			msg.channel.send(__.commanderror());
		}
	}
};
