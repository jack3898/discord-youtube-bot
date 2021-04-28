const Discord = require('discord.js');

/**
 * Take a directory, and a list of file names and create a Discord Collection of modules. Useful for commands.
 * @param {Array} filenames Including extension.
 * @param {*} directory Relative to source folder.
 * @returns {Discord.Collection}
 */
function getModuleCollection(filenames, directory) {
	if (filenames.length) {
		const moduleList = filenames.map(filename => {
			const executable = require(`${srcPath}/${directory}/${filename}`);
			if (executable.name && executable.action) return [executable.name, executable.action];
		});
		return new Discord.Collection(moduleList);
	}
}

module.exports = getModuleCollection;
