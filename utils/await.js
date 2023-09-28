const { EmbedBuilder } = require("discord.js");
const keywordSchema = require("../models/keywordSchema");

const getKeywordSchema = async (guildId) => {
  let doc;
  doc = await keywordSchema.findOne({
    guildId: guildId,
  });

  if (!doc)
    doc = await keywordSchema.create({
      guildId: guildId,
    });

  return doc;
};

const showList = async (interaction, Array, title, type) => {
  const embed = new EmbedBuilder().setColor(0x0099ff).setTitle(title);
  let desc = "";

  for (const [i, word] of Array.entries()) {
    desc += `**${i + 1}** ~ ${
      type === "role" ? `<@&${word}>` : `\`${word}\``
    }\n\n`;
  }

  embed.setDescription(desc || "Nothing to show yet");

  await interaction.reply({
    embeds: [embed],
    ephemeral: true,
  });
};
module.exports = { getKeywordSchema, showList };
