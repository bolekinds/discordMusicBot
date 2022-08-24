const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('⏸ Pause the current song.'),
	async execute(interaction) {
		const { member } = interaction;
		const VoiceChannel = member.voice.channel;

		if (!VoiceChannel) {
			return interaction.reply({
				content: '🔈 Please join a voice channel.',
				ephemeral: true,
			})
		}

		try {
			const client = interaction.client
			const queue = await client.distube.getQueue(VoiceChannel);
			if (!queue) {
			return interaction.reply('⛔ There is no queue.')}

			await queue.pause(VoiceChannel);
			return interaction.reply('⏸ Paused song.');
		} catch (e) {
          interaction.reply('❌ Error: ' + e)
		}
	},
};