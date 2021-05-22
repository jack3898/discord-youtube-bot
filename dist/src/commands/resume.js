import Player from '../utils/classes/Player';
import __ from './../lang/en';
import config from './../../config';
export default {
    name: 'resume',
    description: __.resume(config.prefix),
    action: async (bot, msg) => {
        try {
            const player = Player.getPlayer(msg.guild, bot);
            const success = await player.resume();
            if (!success)
                msg.channel.send(__.unabletoresume());
            else
                msg.channel.send(__.resumed());
        }
        catch (error) {
            console.error(error);
            msg.channel.send(__.commanderror());
        }
    }
};
