const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');

function hexy(rrggbb) {
	var bbggrr = rrggbb.substr(4, 2) + rrggbb.substr(2, 2) + rrggbb.substr(0, 2);
	return parseInt(bbggrr, 16);
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('🎶 Gets the current queue.'),
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

			const embed = new EmbedBuilder()
			.setColor(
        		hexy(
        		 Math.floor(
        		  Math.random() * 16777215
        		  ).toString(16)
        		 )
        		)
						.setDescription(
						`${queue.songs.map(
						(song, id) =>
						`\n**${id + 1}**. ${
						song.name
						} - \`${
						song.formattedDuration
					}\``
				)}`
			);
			return interaction.reply({ embeds: [embed] });
		} catch (e) {
			console.log(e)
          interaction.reply('❌ Error: ' + e)
		}
	},
};