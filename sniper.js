const { Client } = require('discord.js-selfbot-v13');
const extractPokemonData = require('./src/utilities');
const { random } = require('lodash');

const client = new Client();
const channelId = '';
const messageContent = "<@716390085896962058> m s --sh --lim 3";
const priceLimit = 40000; 
let targetChannel;
let buyLock = false; // Mutex lock for buying process

client.on('ready', async () => {
    console.log(`Connected to ${client.user.tag}`);
    targetChannel = await client.channels.fetch(channelId);
    if (!targetChannel) {
        console.error(`Channel with ID ${channelId} not found.`);
        return;
    }
    spamMessages(targetChannel);
});

client.on('messageCreate', async (message) => {
    if (
        message.author.id === '716390085896962058' &&
        message.embeds.length > 0 &&
        message.embeds[0].title.includes('Pokétwo Marketplace') &&
        !buyLock // Check mutex lock
    ) {
        const embed = message.embeds[0];
        const raw = embed.description.split('\n');

        for (const line of raw) {
            const pokemonData = extractPokemonData(line);
            if (pokemonData && parseInt(pokemonData.price) < priceLimit) {
                buyLock = true; 
                await targetChannel.send(`<@716390085896962058> m buy ${pokemonData.id}`);
                break; 
            }
        }
    }

    if (
        message.channel.id === channelId &&
        message.content.toLowerCase().includes('sure')
    ) {
        await message.clickButton();
    }

    if (
        message.channel.id === channelId &&
        message.content.toLowerCase().includes('purchased')
    ) {
        buyLock = false;
        console.log('Bought a pokemon');
    }

    if (
        message.channel.id === channelId &&
        message.content.toLowerCase().includes('listing')
    ) {
        console.log('Missed pokemon');
        buyLock = false; 
    }
});

async function spamMessages(channel) {
    setInterval(() => {
        if (!buyLock) {
            channel.send(messageContent)
                .then(() => console.log('Message sent successfully'))
                .catch(error => console.error('Error sending message:', error));
        } else {
            console.log('Skipping message sending due to active buy process');
        }
    }, random(3, 6) * 1000); 
}

client.login('');
