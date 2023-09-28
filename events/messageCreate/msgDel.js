const { getKeywordSchema } = require("../../utils/await");
const { EmbedBuilder } = require("discord.js");

module.exports = async (message) => {
  const { guild, content, embeds, client, author, member } = message;

  if (author.id === client.user.id) return;

  const { keywords, roles, rolePing, logsChannel } = await getKeywordSchema(
    guild.id
  );

  const roleCheck = roles.every((role) => !member.roles.cache.has(role));

  if (roleCheck) return;

  let data;

  embeds[0] ? (data = embeds[0].data.description) : (data = content);

  const check = keywords.some((word) => data.includes(word));

  if (check) await message.delete().catch((e) => console.error(e));
  else return;
  const logs = await guild.channels.fetch(logsChannel);

  const desc = `**User**: \`${author.username}\`\n\n**Message Content:** \`${data}\`\n\n **Deleted by:** \`${client.user.username}\``;

  const embed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(`Message Delete Logs`)
    .setTimestamp()
    .setDescription(desc);

  await logs.send({
    content: `<@&${rolePing}>`,
    embeds: [embed],
  });
};
