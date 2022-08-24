const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('loop')
		.setDescription('🔁 Repeats/loops a song/queue.')
		.addStringOption((option) =>
		  option
			.setName('loopchoice')
			.setDescription('🔁 What you want to loop.')
			.setRequired(true)
			.addChoices(
			 { name: 'queue', value: 'queue' },
			 { name: 'off', value: 'off' },
			 { name: 'song', value: 'song' }
		   )
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

			if (!queue){
			return interaction.reply('⛔ There is no queue.')}

			let mode = null;
			if (options.getString('loopchoice') === 'off') {
				mode = 0;
			}
			if (options.getString('loopchoice') === 'song') {
				mode = 1;
			}
			if (options.getString('loopchoice') === 'queue') {
				mode = 2;
			}

			mode = queue.setRepeatMode(mode);
			mode = mode
			? mode === 2
			? 'Repeat queue'
			: 'Repeat song'
			: 'Off';
			return interaction.reply(`🔁 Set repeat mode to ${mode}.`);
		} catch (e) {
          interaction.reply('❌ Error: ' + e)
		}
	},
};