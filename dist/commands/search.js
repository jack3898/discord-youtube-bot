import { MessageEmbed } from 'discord.js';
import { getVideoDetails, findYtUrl } from '../utils/functions/getHandlers.js';
import Player from '../utils/classes/Player.js';
export default {
    name: 'search',
    description: __.search(config.prefix),
    action: async (bot, msg, command) => {
        try {
            const queue = Player.getPlayer(msg.guild, bot);
            // These are the reactions that will be reacted to the bot's message
            const reacts = config.search_reaction_options;
            // Send a status message to inform the user the search is taking place
            const statusMsg = await msg.channel.send(__.searching());
            // Resolved URLs from the YouTube API
            const urls = await findYtUrl(command.combined, reacts.length);
            // Turn video URLs into objects with video details.
            const resolvedVideos = await Promise.all(urls.map(getVideoDetails));
            // This is for the MessageEmbed
            const fields = resolvedVideos.map((video, index) => {
                return {
                    name: __.searchitemtitle(index + 1, video.videoDetails.title),
                    value: __.searchitemdesc(video.videoDetails.author.name)
                };
            });
            // Ask the question!
            const question = await msg.reply(new MessageEmbed()
                .setTitle(__.searchtitle())
                .setColor(config.success_colour)
                .addFields(...fields));
            await statusMsg.delete();
            // This makes the bot react to its own message with the given emojis defined in reacts
            // Promise.all is used so that any errors in this process get properly caught
            await Promise.all(reacts.map(react => question.react(react))); // For some reason you need to wrap the function call in another function for this to work??
            // Add the listener
            bot.on('messageReactionAdd', listener);
            // The function that runs when the user reacts to a message
            function listener(reaction) {
                // Check that the user that actually asked the question to the bot is the one reacting
                if (!reaction.users.cache.has(msg.author.id))
                    return;
                // Now check that the reaction that was actually performed (because the reaction add event is global to the server)
                if (reaction.message.id !== question.id)
                    return;
                // "resolvedReaction" is the reaction the user reacted to
                // "rawReaction" is the reaction type found in the config
                const resolvedReaction = reaction.emoji.toString();
                reacts.forEach((rawReaction, index) => {
                    // Check the reaction is eligible for the question response
                    if (resolvedReaction !== rawReaction)
                        return;
                    msg.channel.send(__.addedtoqueue(resolvedVideos[index].videoDetails.title));
                    queue.add(urls[index]);
                    // We no longer want this listener, the question has been answered.
                    bot.removeListener('messageReactionAdd', listener);
                });
            }
            // Set an expiry on the listener. This is for if the user does not answer the question the listener will never lay dormant.
            setTimeout(() => bot.removeListener('messageReactionAdd', listener), config.search_expiry_milliseconds);
        }
        catch (error) {
            console.error(error);
            msg.channel.send(__.commanderror());
        }
    }
};
