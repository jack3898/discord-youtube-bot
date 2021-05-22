import Player from '../utils/classes/Player.js';
export default {
    name: 'clear',
    description: __.clear(config.prefix),
    action: async (bot, msg, command) => {
        try {
            const queue = Player.getPlayer(msg.guild, bot);
            const result = await queue.clear(command.combined);
            if (result)
                msg.channel.send(__.clearedqueue());
        }
        catch (error) {
            console.error(error);
            msg.channel.send(__.commanderror());
        }
    }
};
