import Player from '../utils/classes/Player.js';
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
