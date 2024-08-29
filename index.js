const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function createClient(userId) {
    const sessionPath = path.join(__dirname, 'sessions', userId);

    const client = new Client({
        authStrategy: new LocalAuth({
            clientId: userId,
            dataPath: sessionPath,
        }),
        puppeteer: {
            args: ['--no-sandbox'],
        }
    });

    client.on('qr', (qr) => {
        console.log(`Scan the QR code for user ${userId}:`);
        qrcode.generate(qr, { small: true });
    });

    client.on('authenticated', () => {
        console.log(`User ${userId} authenticated successfully!`);
    });

    client.on('ready', async () => {
        console.log(`Client for user ${userId} is ready!`);

        // Schedule the status viewing every hour
        setInterval(async () => {
            console.log(`Viewing statuses for user ${userId}...`);
            await viewStatuses(client);
        }, 3600000); // 3600000 ms = 1 hour
    });

    client.initialize();
}

async function viewStatuses(client) {
    try {
        const puppeteerPage = await client.pupPage;
        await puppeteerPage.waitForSelector('div[aria-label="Statut"]', { timeout: 1000 });
        
        await puppeteerPage.click('div[aria-label="Statut"]');
        await puppeteerPage.waitForSelector('._ak72', { timeout: 1000 });
        
        const statuses = await puppeteerPage.$$('._ak72');
        for (let status of statuses) {
            await status.click();
            await puppeteerPage.waitForTimeout(10000); 
        }
        
        console.log('All statuses have been viewed.');
    } catch (error) {
        console.error('An error occurred:', error.message);
    }
}

// Example: Creating clients for multiple users
const userIds = ['user1', 'user3', 'user8', 'user4'];

userIds.forEach(userId => {
    createClient(userId);
});
