import { getFileList, getModuleCollection } from '../utils/functions/getHandlers.js';
import paginate from '../utils/functions/paginate.js';
import { MessageEmbed } from 'discord.js';
export default {
    name: 'help',
    description: __.help(config.prefix),
    action: async (bot, msg, command) => {
        try {
            const commandModules = getFileList('commands');
            const collection = Array.from(await getModuleCollection(commandModules, 'commands'));
            const page = command.args[0] || 1; // Arrays start from index 0, so this will stop users from accessing page 1 with 0
            const perPage = 10;
            const paginatedArr = paginate(collection, page, perPage);
            const pageCount = paginatedArr.pageCount;
            const embedFields = paginatedArr.page.map(item => ({ name: `${config.prefix}${item[0]}`, value: item[1].description }));
            if (!paginatedArr.page.length) {
                msg.channel.send(__.emptypage());
                return;
            }
            const message = new MessageEmbed()
                .setColor(config.success_colour)
                .setTitle(__.helptitle(page, pageCount))
                .setDescription(__.helpdesc(paginatedArr.page.length))
                .addFields(...embedFields);
            msg.channel.send(message);
        }
        catch (error) {
            console.error(error);
        }
    }
};
