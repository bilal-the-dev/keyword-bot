const { CommandType } = require("wokcommands");
const { getKeywordSchema } = require("../utils/await");
const { PermissionsBitField } = require("discord.js");

module.exports = {
  // Required for slash commands
  description: "role command",

  // Create a legacy and slash command
  type: CommandType.SLASH,
  options: [
    {
      name: "channel",
      description: "Operation to perform",
      type: 7,
      required: true,
    },
    {
      name: "pingrole",
      description: "role to be pinged",
      type: 8,
      required: true,
    },
  ],
  //  nvoked when a user runs the ping command
  callback: async ({ interaction }) => {
    const { options, guild, member } = interaction;

    if (!member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      await interaction.reply({
        content: `Err! \`Admin only.\``,
        ephemeral: true,
      });
      return;
    }
    const channel = options.getChannel("channel");
    const { id } = options.getRole("pingrole");
    const doc = await getKeywordSchema(guild.id);

    if (channel.type !== 0) {
      await interaction.reply({
        content: `Err! \`Please mention a text channel.\``,
        ephemeral: true,
      });
      return;
    }

    await interaction.reply({
      content: `Success!`,
      ephemeral: true,
    });

    await doc.updateOne({
      $set: {
        rolePing: id,
        logsChannel: channel,
      },
    });
  },
};
