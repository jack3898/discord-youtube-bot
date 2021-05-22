import Player from '../utils/classes/Player';
import __ from './../lang/en';
import config from './../../config';
export default {
    name: 'stop',
    description: __.stop(config.prefix),
    action: async (bot, msg) => {
        try {
            const player = Player.getPlayer(msg.guild, bot);
            player.finish();
        }
        catch (error) {
            console.error(error);
            msg.channel.send(__.commanderror());
        }
    }
};
