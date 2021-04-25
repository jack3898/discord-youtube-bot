const Discord = require('discord.js');

class CommandProcessor {
	constructor(msg) {
		if (!msg instanceof Discord.Message) throw TypeError('Argument 1 is not of instance Message!');

		this.text = msg.content;
		this.prefix = config.prefix;
		this.textArr = this.text.trim().substring(this.prefix.length).split(/\s+/);
	}

	/**
	 * Get all singular arguments as a new Set instance.
	 * @returns {Set}
	 */
	get args() {
		const [cmd, ...args] = this.textArr.filter(item => !item.startsWith(config.option_prefix));
		return new Set(args);
	}

	/**
	 * Get both arguments and options from the users command as a new object.
	 * @returns {Object}
	 */
	get all() {
		return {
			command: this.cmd,
			arguments: this.args
		};
	}

	/**
	 * Get the command.
	 * @returns {string}
	 */
	get cmd() {
		const [cmd] = this.textArr;
		return cmd;
	}

	/**
	 * Does the user's command posess a specific argument?
	 * @param {string} arg The argument to test for.
	 * @returns {Boolean}
	 */
	hasArg(arg) {
		return this.args.has(arg);
	}
}

module.exports = CommandProcessor;
