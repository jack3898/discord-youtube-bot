const {Guild} = require('discord.js');
const Player = require('../classes/Player');

/**
 * Get a player for a guild. A player is an instance of Player() and contains info about currently running music.
 * @param {Discord.Guild} guild
 * @param {Discord.Client} bot
 * @returns {Player}
 */
function getPlayer(guild, bot) {
	if (!guild instanceof Guild) throw TypeError('Argument 1, "guild" is not an instance of Discord.Guild!');

	const player = bot.players.get(guild.id);
	if (player instanceof Player) return player;

	bot.players.set(guild.id, new Player(guild, bot));
	return bot.players.get(guild.id);
}

module.exports = getPlayer;
