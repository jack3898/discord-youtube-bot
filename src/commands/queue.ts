import {MessageEmbed} from 'discord.js';
import {getVideoDetails} from '../utils/functions/getHandlers';
import Player from '../utils/classes/Player';
import __ from './../lang/en';
import config from './../../config';

export default {
	name: 'queue',
	description: __.queue(config.prefix),
	action: async (bot, msg, command) => {
		try {
			const page = command.args[0] || 1;
			const queue = Player.getPlayer(msg.guild, bot);
			const result = await queue.get(page);

			if (result.queue.length === 0) {
				msg.channel.send(__.emptyqueue());
				return;
			}

			// Gather all video details. As it is async, the array will be a list of promises.
			const videos = result.queue.map(async url => {
				const details: any = await getVideoDetails(url);

				if (details) return details.videoDetails;
				return url;
			});

			const statusMsg = await msg.channel.send(__.fetchingqueue());

			// Wait for all promises to fulfill
			const resolvedVideos = await Promise.all(videos);
			const numberFormat = new Intl.NumberFormat(__.numberFormat);

			const embedFields = resolvedVideos.map((video: any, index) => {
				const views = numberFormat.format(video.viewCount);
				const likes = numberFormat.format(video.likes);
				const dislikes = numberFormat.format(video.dislikes);
				const userIndex = index + result.startsFrom + 1;
				const title = video.title || __.queueitemtitleunavailable();
				const author = video.author?.name || __.queueitemauthorunavailable();

				return {
					name: __.queueitemtitle(userIndex, title, author),
					value: __.queueitemdesc(views, likes, dislikes)
				};
			});

			const reply = new MessageEmbed()
				.setColor(config.success_colour)
				.setTitle(__.queuetitle())
				.setDescription(__.queuedesc(result.page, result.pages))
				.addFields(...embedFields);

			// Construct the list!
			await statusMsg.delete();
			msg.channel.send(reply);
		} catch (error) {
			console.error(error);
			msg.channel.send(__.commanderror());
		}
	}
};
