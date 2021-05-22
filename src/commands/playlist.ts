import {getPlaylist} from '../utils/functions/getHandlers';
import Player from '../utils/classes/Player';
import __ from './../lang/en';
import config from './../../config';

export default {
	name: 'playlist',
	description: __.playlist(config.prefix),
	action: async (bot, msg, command) => {
		try {
			const result = await getPlaylist(command.args[0]);
			const queue = await Player.getPlayer(msg.guild, bot);
			const addedUrls = result.map(queue.add);

			const initialMsg = await msg.channel.send(__.importingplaylist());

			await Promise.allSettled(addedUrls);

			if (initialMsg.deletable) initialMsg.delete();

			msg.channel.send(__.playlistinqueue());
		} catch (error) {
			console.error(error);
			msg.channel.send(__.commanderror());
		}
	}
};
