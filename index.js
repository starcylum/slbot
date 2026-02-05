const {
  Client,
  GatewayIntentBits,
  PermissionsBitField
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

const PREFIX = "!";

client.once("ready", () => {
  console.log(`🌌 Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;
  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // :test_tube: PING
  if (command === "ping") {
    return message.reply(":ping_pong: Pong!");
  }

  // :broom: CLEAR
  if (command === "clear") {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return message.reply(":x: You need Manage Messages permission.");
    }

    const amount = parseInt(args[0]);
    if (!amount || amount < 1 || amount > 100) {
      return message.reply(":x: Use: !clear 1–100");
    }

    await message.channel.bulkDelete(amount, true);
    message.channel.send(`🧹 Deleted ${amount} messages.`);
  }

  // :boot: KICK
  if (command === "kick") {
    if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return message.reply(":x: You need Kick permission.");
    }

    const member = message.mentions.members.first();
    if (!member) return message.reply(":x: Mention a user to kick.");

    const reason = args.slice(1).join(" ") || "No reason given";
    await member.kick(reason);

    message.channel.send(`👢 ${member.user.tag} was kicked.\nReason: ${reason}`);
  }

  // :hammer: BAN
  if (command === "ban") {
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return message.reply(":x: You need Ban permission.");
    }

    const member = message.mentions.members.first();
    if (!member) return message.reply(":x: Mention a user to ban.");

    const reason = args.slice(1).join(" ") || "No reason given";
    await member.ban({ reason });

    message.channel.send(`🔨 ${member.user.tag} was banned.\nReason: ${reason}`);
  }

  // :loudspeaker: ANNOUNCE
  if (command === "announce") {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply(":x: Admin only.");
    }

    const text = args.join(" ");
    if (!text) return message.reply(":x: Use: !announce <message>");

    message.channel.send(`📢 **Announcement**\n${text}`);
  }

  // :envelope: DM ONE USER
  if (command === "dm") {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply(":x: Admin only.");
    }

    const user = message.mentions.users.first();
    if (!user) return message.reply(":x: Mention a user.");

    const text = args.slice(1).join(" ");
    if (!text) return message.reply(":x: Use: !dm @user <message>");

    user.send(`🌌 **Star’s Legacy Message**\n\n${text}`)
      .then(() => message.reply(":white_check_mark: DM sent."))
      .catch(() => message.reply(":x: User has DMs closed."));
  }

  // :envelope_with_arrow: DM ALL MEMBERS (USE CAREFULLY)
  if (command === "dmall") {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply(":x: Admin only.");
    }

    const text = args.join(" ");
    if (!text) return message.reply(":x: Use: !dmall <message>");

    message.reply(":envelope_with_arrow: Sending DMs...");

    message.guild.members.fetch().then(members => {
      members.forEach(member => {
        if (member.user.bot) return;
        member.send(`🌌 **Star’s Legacy Announcement**\n\n${text}`)
          .catch(() => {});
      });
    });
  }
});


client.login(process.env.TOKEN);
