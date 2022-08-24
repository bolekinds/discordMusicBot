const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('volume')
		.setDescription('🔊 Sets the current song volume.')
		.addNumberOption((option) =>
			option
			.setName('percent')
			.setDescription('The amount of volume.')
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
			const Volume = options.getNumber('percent');

 			 if (!queue) {
				return interaction.reply('⛔ There is no queue.')}
  
			if (Volume > 100 || Volume < 1)
				return interaction.reply({
					content:
					'You have to specify a number between 1 and 100.',
				});

			client.distube.setVolume(VoiceChannel, Volume);
			return interaction.reply({
				content: `🔊 Volume has been set to ${Volume}%.`,
			});
		} catch (e) {
          interaction.reply('❌ Error: ' + e)
		}
	},
};