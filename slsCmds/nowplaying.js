const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');

function hexy(rrggbb) {
	var bbggrr = rrggbb.substr(4, 2) + rrggbb.substr(2, 2) + rrggbb.substr(0, 2);
	return parseInt(bbggrr, 16);
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('nowplaying')
		.setDescription('Gets the now playing song.'),
	async execute(interaction) {
		const { member, client } = interaction;
		const VoiceChannel = member.voice.channel;

		if (!VoiceChannel) {
			return interaction.reply({
				content: '🔈 Please join a voice channel.',
				ephemeral: true,
			})
		}

		try {
			const queue = await client.distube.getQueue(VoiceChannel);
			if (!queue) {
			return interaction.reply('⛔ There is no queue.')}

			const song = queue.songs[0]
			const embed = new EmbedBuilder()
            .setTitle(`${song.name}`)
            .setColor(
        		hexy(
        		 Math.floor(
        		  Math.random() * 16777215
        		  ).toString(16)
        		 )
        		)
              .setURL(song.url)
              .setDescription(`Duration: ${song.formattedDuration}, Requested by ${song.user}`)
              .setImage(song.thumbnail)
              .setTimestamp()
              return interaction.reply({embeds: [embed]})
		} catch (e) {
          interaction.reply('❌ Error: ' + e)
		}
	},
};