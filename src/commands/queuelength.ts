import Player from '../utils/classes/Player';
import __ from './../lang/en';
import config from './../../config';

export default {
	name: 'queuelength',
	description: __.queuelength(config.prefix),
	action: async (bot, msg) => {
		try {
			const queue = Player.getPlayer(msg.guild, bot);
			const length = await queue.length();

			if (length) msg.channel.send(__.totalqueuelength(length));
			else msg.channel.send(__.emptyqueue());
		} catch (error) {
			console.error(error);
			msg.channel.send(__.commanderror());
		}
	}
};
