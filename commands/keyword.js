const { CommandType } = require("wokcommands");
const { getKeywordSchema, showList } = require("../utils/await");

const { PermissionsBitField } = require("discord.js");
module.exports = {
  // Required for slash commands
  description: "blacklist command",

  // Create a legacy and slash command
  type: CommandType.SLASH,
  options: [
    {
      name: "add",
      description: "Adds a keyword to black list",
      type: 1,
      options: [
        {
          name: "keyword",
          description: "keyword to add",
          type: 3,
          required: true,
        },
      ],
    },
    {
      name: "remove",
      description: "Removes a keyword from black list",
      type: 1,

      options: [
        {
          name: "keyword",
          description: "keyword to be removed",
          type: 3,
          autocomplete: true,
          required: true,
        },
      ],
    },
    {
      name: "list",
      description: "Lists all black listed keywords",
      type: 1,
    },
  ],
  autocomplete: async (command, argument, interaction) => {
    const doc = await getKeywordSchema(interaction.guild.id);
    return doc.keywords;
  },
  // Invoked when a user runs the ping command
  callback: async ({ interaction }) => {
    const { options, guild, member } = interaction;

    if (!member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      await interaction.reply({
        content: `Err! \`Admin only.\``,
        ephemeral: true,
      });
      return;
    }

    const subCommand = options.getSubcommand();

    const doc = await getKeywordSchema(guild.id);

    const { keywords } = doc;

    if (subCommand === "list") {
      showList(interaction, keywords, "Blacklisted Words", "keyword");
      return;
    }

    const keyword = options.getString("keyword");

    if (subCommand === "add") {
      if (keywords.includes(keyword)) {
        await interaction.reply({
          content: `Err! \`The Keyword already exists in database.\``,
          ephemeral: true,
        });
        return;
      }
      await interaction.reply({
        content: `Success! Added the keyword \`${keyword}\` to the database.`,
        ephemeral: true,
      });
      await doc.updateOne({
        $push: {
          keywords: keyword,
        },
      });
    } else {
      if (!keywords.includes(keyword)) {
        await interaction.reply({
          content: `Err! \`The Keyword does not exist in database.\``,
          ephemeral: true,
        });
        return;
      }

      await interaction.reply({
        content: `Success! Removed the keyword \`${keyword}\` from the database.`,
        ephemeral: true,
      });

      const newKeywordsArr = keywords.filter((word) => word !== keyword);

      await doc.updateOne({
        $set: {
          keywords: newKeywordsArr,
        },
      });
    }
  },
};
