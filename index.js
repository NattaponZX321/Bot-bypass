const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, InteractionType } = require('discord.js');
const fetch = require('node-fetch');

const TOKEN = " "; // 🔥 ใส่ Token ตรงนี้
const API_BASE = "https://api-bypass.robloxexecutorth.workers.dev/";

const bot = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const getApiLink = (url, bypassType) => `${API_BASE}${bypassType}?url=${encodeURIComponent(url)}`;

bot.once("ready", () => {
    console.log(`✅ บอท ${bot.user.tag} พร้อมใช้งาน!`);
    bot.user.setActivity("Bypass 🔓", { type: 3 });
});

// คำสั่ง !bypass
bot.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand() || interaction.commandName !== "bypass") return;

    const options = [
        { label: "Fluxus", value: "fluxus", emoji: "<:a_:1204738154045906984>" },
        { label: "Linkvertise", value: "linkvertise", emoji: "<:Linkvertise:1266787483169849365>" },
        { label: "Rekonise", value: "rekonise", emoji: "<:Rekonise:1273990792062697595>" },
        { label: "Delta", value: "delta", emoji: "<:1175308654023557140:1204738376742215710>" },
        { label: "Arceus X", value: "arceusx", emoji: "<:Arceusx:1278374438743703657>" },
        { label: "Work.ink", value: "workink", emoji: "<:Workink:1284411465872441426>" },
        { label: "Mediafire", value: "mediafire", emoji: "<:mediafire1:1289437115230322729>" },
        { label: "Codex", value: "codex", emoji: "<:Codex:1273713250223259813>" },
        { label: "Trigon", value: "trigon", emoji: "<:Trigon:1300786550526709821>" },
        { label: "Cryptic", value: "cryptic", emoji: "<:Cryptic:1304387871016222740>" }
    ];

    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId("bypass_select")
        .setPlaceholder("🤖 เลือกตัวรัน")
        .addOptions(options.map(opt => new StringSelectMenuOptionBuilder(opt)));

    const row = new ActionRowBuilder().addComponents(selectMenu);

    const embed = new EmbedBuilder()
        .setTitle("🔓 Bypass Menu")
        .setDescription("กรุณาเลือกบริการที่คุณต้องการ Bypass")
        .setColor(0x9b59b6)
        .setImage("https://cdn.discordapp.com/attachments/1294864230557814898/1307732663439724584/a689d1186a6976a296dac6135d16e7af_1.gif")
        .setFooter({ text: "Nattaponx" });

    await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
});

// จัดการเลือก Bypass
bot.on("interactionCreate", async (interaction) => {
    if (!interaction.isStringSelectMenu() || interaction.customId !== "bypass_select") return;

    const bypassType = interaction.values[0];

    const modal = new ModalBuilder()
        .setCustomId(`bypass_modal_${bypassType}`)
        .setTitle("ลิ้งที่ต้องการหาคีย์")
        .addComponents(
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId("bypass_url")
                    .setLabel("Link to Bypass")
                    .setPlaceholder("ลิ้งของท่าน")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
            )
        );

    await interaction.showModal(modal);
});

// ดำเนินการ Bypass
bot.on("interactionCreate", async (interaction) => {
    if (!interaction.isModalSubmit() || !interaction.customId.startsWith("bypass_modal_")) return;

    const bypassType = interaction.customId.split("_")[2];
    const url = interaction.fields.getTextInputValue("bypass_url");
    const apiLink = getApiLink(url, bypassType);

    await interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setTitle("กำลัง Bypass...")
                .setDescription(`ลิ้งของคุณ: \`${url}\`\nกรุณารอประมาณ 5 วินาที...`)
                .setColor(0x3498db)
        ],
        ephemeral: true
    });

    try {
        const response = await fetch(apiLink);
        const json = await response.json();
        const key = json.key;

        if (!key || key === "ไม่พบคีย์") {
            throw new Error("ไม่สามารถดึงข้อมูลจาก API ได้ กรุณาตรวจสอบลิ้งค์หรือ API อีกครั้ง");
        }

        await interaction.followUp({
            embeds: [
                new EmbedBuilder()
                    .setTitle("🌐 Bypass สำเร็จ")
                    .setDescription(`📃 คีย์ของท่าน:\n\`\`\`${key}\`\`\``)
                    .setColor(0x2ecc71)
                    .setFooter({ text: "Bypassed Successfully" })
            ],
            ephemeral: true
        });

    } catch (error) {
        await interaction.followUp({
            embeds: [
                new EmbedBuilder()
                    .setTitle("❌ เกิดข้อผิดผลาด")
                    .setDescription(error.message)
                    .setColor(0xe74c3c)
            ],
            ephemeral: true
        });
    }
});

bot.login(TOKEN);
//โค้ดนี้ทำโดย bot Nattapon
//https://discord.gg/CTNjjjw4vW
