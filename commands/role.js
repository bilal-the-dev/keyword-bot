const { CommandType } = require("wokcommands");
const { getKeywordSchema, showList } = require("../utils/await");
const { PermissionsBitField } = require("discord.js");

module.exports = {
  // Required for slash commands
  description: "role command",

  // Create a legacy and slash command
  type: CommandType.SLASH,
  options: [
    {
      name: "operation",
      description: "Operation to perform",
      type: 3,
      required: true,
      choices: [
        {
          name: "add",
          value: "add",
        },
        {
          name: "remove",
          value: "remove",
        },
        {
          name: "list",
          value: "list",
        },
      ],
    },
    {
      name: "role",
      description: "role to be added/removed",
      type: 8,
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

    const operation = options.getString("operation");
    const doc = await getKeywordSchema(guild.id);

    const { roles } = doc;

    if (operation === "list") {
      showList(interaction, roles, "Roles", "role");
      return;
    }

    const role = options.getRole("role");

    if (!role) {
      await interaction.reply({
        content: `Err! \`Please mention a role.\``,
        ephemeral: true,
      });
      return;
    }

    const { id, name } = role;

    if (operation === "add") {
      if (roles.includes(id)) {
        await interaction.reply({
          content: `Err! \`The role already exists in database.\``,
          ephemeral: true,
        });
        return;
      }
      await interaction.reply({
        content: `Success! Added the role \`${name}\` to the database.`,
        ephemeral: true,
      });
      await doc.updateOne({
        $push: {
          roles: id,
        },
      });
    } else {
      if (!roles.includes(id)) {
        await interaction.reply({
          content: `Err! \`The role does not exist in database.\``,
          ephemeral: true,
        });
        return;
      }

      await interaction.reply({
        content: `Success! Removed the role \`${name}\` from the database.`,
        ephemeral: true,
      });

      const rolesArr = roles.filter((word) => word !== id);

      await doc.updateOne({
        $set: {
          roles: rolesArr,
        },
      });
    }
  },
};
