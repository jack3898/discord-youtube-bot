import Player from '../utils/classes/Player.js';
export default {
    name: 'remove',
    description: __.remove(config.prefix),
    action: async (bot, msg, command) => {
        try {
            const queue = Player.getPlayer(msg.guild, bot);
            const queueItem = parseInt(command.args[0]);
            if (!Number.isNaN(queueItem)) {
                const item = await queue.get(queueItem, 1); // Redis requires a value as well to remove the item.
                const result = await queue.remove(queueItem, item.queue[0]);
                if (result)
                    msg.channel.send(__.removed());
            }
            else
                msg.channel.send(__.noremovalnumber());
        }
        catch (error) {
            console.error(error);
            msg.channel.send(__.commanderror());
        }
    }
};
