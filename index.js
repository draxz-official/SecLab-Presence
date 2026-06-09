// Rich Presence By SecLab BR
const { Client } = require('discord.js-selfbot-v13');
const fs = require('fs');
require('dotenv').config(); // carrega o .env

const client = new Client({
    checkUpdate: false
});

// Anti crash
process.on('unhandledRejection', err => console.log('⚠️', err));
process.on('uncaughtException', err => console.log('⚠️', err));

// ======================
// ARQUIVO DE DADOS
// ======================
const FILE = './data.json';

function loadData() {
    try {
        if (!fs.existsSync(FILE)) {
            fs.writeFileSync(FILE, JSON.stringify({ dias: 0, horas: 0 }, null, 2));
        }

        const data = JSON.parse(fs.readFileSync(FILE));
        return {
            dias: data.dias || 0,
            horas: data.horas || 0
        };
    } catch (e) {
        console.log("Erro ao carregar dados, usando 0");
        return { dias: 0, horas: 0 };
    }
}

function saveData() {
    try {
        fs.writeFileSync(FILE, JSON.stringify({ dias, horas }, null, 2));
        console.log(`💾 Salvo: ${dias}d ${horas}h`);
    } catch (e) {
        console.log("Erro ao salvar");
    }
}

// Carrega os dados salvos
let { dias, horas } = loadData();

let baseTime = Date.now();

// ======================
// PRESENCE
// ======================
async function updatePresence() {
    if (!client.user) return;

    const startTime = baseTime - ((dias * 24 + horas) * 60 * 60 * 1000);

    try {
        await client.user.setActivity({
            name: "NOME DA SUA ATIVIDADE",
            type: "PLAYING",
            details: "DESCRICAO DA SUA ATIVIDADE",
            state: `Online há ${dias}d ${horas}h`,
            assets: {
                large_image: "https://cdn.discordapp.com/attachments/1485464454165565607/1513668865899368548/721885a0d07c1c74b9789349d4d8bbe7.jpg?ex=6a28917c&is=6a273ffc&hm=eda4f360d82eb46433266e6e327bd2f96eaf932f61d5b1ed2f92945ca10d6875&.png",
                large_text: "God is so good.",
                small_image: "https://cdn.discordapp.com/attachments/1485464454165565607/1513668865899368548/721885a0d07c1c74b9789349d4d8bbe7.jpg?ex=6a28917c&is=6a273ffc&hm=eda4f360d82eb46433266e6e327bd2f96eaf932f61d5b1ed2f92945ca10d6875&.png",
                small_text: "👻 Passion for learning"
            },
            timestamps: {
                start: startTime
            }
        });

        client.user.setStatus("online");
        console.log(`🔄 Atualizado: ${dias}d ${horas}h`);

    } catch (err) {
        console.log("❌ Presence error:", err.message);
    }
}

// ======================
// READY
// ======================
client.on('ready', async () => {
    console.log(`✅ Logado como ${client.user.tag}`);
    updatePresence();
});

// ======================
// COMANDO
// ======================
client.on('messageCreate', async (message) => {
    try {
        if (!message?.content) return;
        if (message.author.id !== client.user.id) return;

        const args = message.content.trim().split(' ');

        if (args[0].toLowerCase() === '!setdayrich') {
            dias = parseInt(args[1]) || 0;
            horas = parseInt(args[2]) || 0;

            saveData();
            await updatePresence();

            // Confirmação no chat
            message.reply(`✅ **Pronto meu chapa!** Tempo setado pra **${dias}d ${horas}h**`).catch(() => {});
            
            console.log(`💾 Setado: ${dias}d ${horas}h`);
        }
    } catch (err) {
        console.log("⚠️ comando error:", err);
    }
});

// ======================
// LOGIN
// ======================
const token = process.env.TOKEN;

if (!token) {
    console.error("❌ TOKEN não encontrado!");
    console.error("Cria um arquivo .env na pasta e coloca TOKEN=seu_token");
    process.exit(1);
} else {
    client.login(token).catch(err => {
        console.error("❌ Erro no login:", err.message);
    });
}