const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('seek')
		.setDescription('⏩ Seeks to a certain timestamp')
		.addNumberOption((option) =>
			option
			.setName('time')
			.setDescription('Which time in seconds you want to skip to.')
			.setRequired(true)
		),
	async execute(interaction) {
		const { member, client, options } = interaction;
		const VoiceChannel = member.voice.channel;

		if (!VoiceChannel) {
			return interaction.reply({
				content: '🔈 Please join a voice channel.',
				ephemeral: true,
			})
		}

		try {
			const queue = await client.distube.getQueue(VoiceChannel);
			const time = options.getNumber('time')
			if (!queue) {
			return interaction.reply('⛔ There is no queue.')}

			queue.seek(time)
			return interaction.reply({
				content: '⏩ Seeked to ' + time + ".",
		    });
		} catch (e) {
          interaction.reply('❌ Error: ' + e)
		}
	},
};