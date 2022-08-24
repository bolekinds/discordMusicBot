const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

module.exports = (client) => {
	const cmds = fs
		.readdirSync('./slsCmds/')
		.filter((f) => f.split('.').pop() === 'js');

	const commands = [];

	for (const file of cmds) {
		const command = require(`../slsCmds/${file}`);
		commands.push(command.data.toJSON());
		client.slsCommands.set(command.data.name, command);
	}

	client.once('ready', () => {
		const rest = new REST({
			version: '9',
		}).setToken(client.config.token);
		(async () => {
			try {
				if (client.config.slashGlobal || !client.config.testGuildID) {
					await rest.put(Routes.applicationCommands(client.user.id), {
						body: commands,
					});
					console.log('Loaded slash commands (GLOBAL)');
				} else {
					await rest.put(
						Routes.applicationGuildCommands(
							client.user.id,
							client.config.testGuildID
						),
						{
							body: commands,
						}
					);
					console.log(
						'Loaded slash commands (DEVELOPMENT)'
					);
				}
			} catch (e) {
				console.error(e);
			}
		})();
	});
};
