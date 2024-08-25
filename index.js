// // const { Client, LocalAuth } = require('whatsapp-web.js');
// // const qrcode = require('qrcode-terminal');
// // const puppeteer = require('puppeteer');
// // const path = require('path');

// // // Function to create a new client for a user
// // async function createClient(userId) {
// //     const sessionPath = path.join(__dirname, 'sessions', userId);

// //     // Create a new instance of the Client with a unique LocalAuth session
// //     const client = new Client({
// //         authStrategy: new LocalAuth({
// //             clientId: userId, // Unique identifier for the session
// //             dataPath: sessionPath // Store the session in a unique folder
// //         }),
// //         puppeteer: {
// //             args: ['--no-sandbox'],
// //         }
// //     });

// //     // Generate and display QR code for new sessions
// //     client.on('qr', (qr) => {
// //         console.log(`Scan the QR code for user ${userId}:`);
// //         qrcode.generate(qr, { small: true });
// //     });

// //     // Log successful authentication
// //     client.on('authenticated', () => {
// //         console.log(`User ${userId} authenticated successfully!`);
// //     });

// //     // Ready event
// //     client.on('ready', async () => {
// //     // console.log('Client is ready!');
// //         console.log(`Client for user ${userId} is ready!`);
// //         const puppeteerPage = await client.pupPage;
// //         try {
// //             // Wait for the status icon to be available
// //             await puppeteerPage.waitForSelector('._2oldI', { timeout: 10000 }); // Adjusted selector
// //             await puppeteerPage.click('._2oldI'); // Click on the status icon
    
// //             // Wait for statuses to load
// //             await puppeteerPage.waitForSelector('._1yHR2', { timeout: 10000 }); // Wait for status elements to appear
    
// //             // Select and view all statuses
// //             const statuses = await puppeteerPage.$$('._1lF-3'); // Adjust selector as needed
// //             for (let status of statuses) {
// //                 await status.click();
// //                 await puppeteerPage.waitForTimeout(5000); // Wait for 5 seconds before viewing the next status
// //             }
    
// //             console.log('All statuses have been viewed.');
// //         } catch (error) {
// //             console.error('An error occurred:', error.message);
// //         }
// // });
// //     // Ready event
// // //     client.on('ready', async () => {

        
// // //         console.log(`Client for user ${userId} is ready!`);

// // //         // // Automate the viewing of statuses for this user
// // //         // const browser = await puppeteer.launch({
// // //         //     headless: false,  // Set to true to run in the background
// // //         // });
// // //         // const page = await browser.newPage();
// // //         // await page.goto('https://web.whatsapp.com', { timeout: 60000 });

// // //         // // Wait for the WhatsApp Web interface to load
// // //         // await page.waitForSelector('._1yHR2' , { timeout: 60000 });  // Adjust selector as needed

// // //         // // Click on the Status tab
// // //         // await page.click('span[data-icon="status-v3"]');

// // //         // // Wait for the statuses to load and click on your status
// // //         // await page.waitForSelector('._1lF-3', { timeout: 60000 });  // Adjust selector as needed
// // //         // await page.click('._1lF-3', { timeout: 60000 });  // This should open your status


// // //  // Get cookies and local storage data
// // //  const puppeteerPage = await client.pupBrowser.pages();
// // //  const cookies = await puppeteerPage[0].cookies();
// // //  const localStorageData = await puppeteerPage[0].evaluate(() => {
// // //      let json = {};
// // //      for (let i = 0; i < localStorage.length; i++) {
// // //          let key = localStorage.key(i);
// // //          json[key] = localStorage.getItem(key);
// // //      }
// // //      return json;
// // //  });

// // //  // Pass cookies and local storage to Puppeteer
// // //  await viewStatusWithPuppeteer(cookies, localStorageData);
// // //         // Optionally, close the browser after viewing the status
// // //         // await browser.close();
// // //     });

// //     // Initialize the client
// //     client.initialize();
// // }

// // async function viewStatusWithPuppeteer(cookies, localStorageData) {
// //     const browser = await puppeteer.launch({
// //         headless: false,  // Set to true to run in the background
// //     });
// //     const page = await browser.newPage();

// //     // Set cookies
// //     await page.setCookie(...cookies);

// //     // Set local storage data
// //     await page.goto('https://web.whatsapp.com');
// //     await page.evaluate((data) => {
// //         for (const [key, value] of Object.entries(data)) {
// //             localStorage.setItem(key, value);
// //         }
// //     }, localStorageData);

// //     // Reload the page with the session data
// //     await page.reload();

// //     // Ensure the session is fully loaded
// //     await page.waitForSelector('._1yHR2', { timeout: 600000 });  // Adjust selector as needed

// //     // Automate the viewing of statuses
// //     await page.click('span[data-icon="status-v3"]');
// //     await page.waitForSelector('._1lF-3', { timeout: 600000 });  // Adjust selector as needed
// //     await page.click('._1lF-3');  // This should open your status

// //     // Optionally, close the browser after viewing the status
// //     // await browser.close();
// // }


// // // Example: Creating clients for multiple users
// // const userIds = ['user1', 'user2', 'user3']; // Replace with your unique user identifiers

// // // Create a client for each user
// // userIds.forEach(userId => {
// //     createClient(userId);
// // });


const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
// Function to create a new client for a user
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
        const puppeteerPage = await client.pupPage;
        try {
           
            await puppeteerPage.waitForSelector('div[aria-label="Statut"]', { timeout: 10000 });
            const elementHTML = await puppeteerPage.evaluate(() => {
                const element = document.querySelector('div[aria-label="Statut"]');
                return element ? element.outerHTML : 'Element not found';
            });




            // await puppeteerPage.waitForSelector('div[aria-label="Actus"]', { timeout: 10000 });
            // const elementHTM = await puppeteerPage.evaluate(() => {
            //     const element = document.querySelector('div[aria-label="Actus"]');
            //     return element ? element.outerHTML : 'Element not found';
            // });

            // await puppeteerPage.waitForSelector('div[aria-label="Status"]', { timeout: 10000 });
            // const elementHT = await puppeteerPage.evaluate(() => {
            //     const element = document.querySelector('div[aria-label="Status"]');
            //     return element ? element.outerHTML : 'Element not found';
            // });

//             const htmlContent = await puppeteerPage.content();

//             // Save the HTML to a file
//             fs.writeFileSync('page.html', htmlContent);

//             const words = ['status','Status','Actus','actus'];

// const matchingElements = await puppeteerPage.evaluate((words) => {
//     // Get all elements in the document
//     const elements = document.querySelectorAll('*');
//     const matchedElements = [];
    
//     // Loop through all elements
//     elements.forEach(element => {
//         const text = element.textContent.toLowerCase();
        
//         // Check if the element's text includes any of the words
//         if (words.some(word => text.includes(word.toLowerCase()))) {
//             matchedElements.push(element.outerHTML);
//         }
//     });

//     return matchedElements;
// }, words);

// console.log('Matched elements:', matchingElements);
            // aria-label="Add Status"
            // Log the HTML content to the console
            console.log('HTML content of the element with class ._ajv8:', elementHTML);

            await puppeteerPage.click('div[aria-label="Statut"]');
    
           
            // await puppeteerPage.waitForSelector('.x1n2onr6.x1vqgdyp', { timeout: 10000 });
    
            // x1iyjqo2 x6ikm8r x10wlt62 x1n2onr6 xlyipyv xuxw1ft _ao3e

            // await puppeteerPage.waitForSelector('._ak72._ak73', { timeout: 10000 });
            // const elementHTM = await puppeteerPage.evaluate(() => {
            //     const element = document.querySelector('._ak72]');
            //     return element ? element.outerHTML : 'Element not found';
            // });

            await puppeteerPage.waitForSelector('._ak8l', { timeout: 10000 });
            const elementHTM = await puppeteerPage.evaluate(() => {
                const element = document.querySelector('._ak8l');
                return element ? element.outerHTML : 'Element not found';
            });

            const statuses = await puppeteerPage.$$('._ak8l',{ timeout: 10000 });
            // data-focusid="status-row-item"   
            const htmlContent = await puppeteerPage.content();
            fs.writeFileSync('page2.html', htmlContent);
            for (let status of statuses) {
              console.log(0)
                await status.click();
                await puppeteerPage.waitForTimeout(6000);
            }

           
            
            
            console.log('All statuses have been viewed.');
        } catch (error) {
            console.error('An error occurred:', error.message);
        }
    });

    client.initialize();
}

// Example: Creating clients for multiple users
const userIds = ['user1', 'user3'];

userIds.forEach(userId => {
    createClient(userId);
});


// const { Client, LocalAuth } = require('whatsapp-web.js');
// const qrcode = require('qrcode-terminal');
// const puppeteer = require('puppeteer');
// const path = require('path');
// const fs = require('fs');

// // Function to create a new client for a user
// async function createClient(userId) {
//     const sessionPath = path.join(__dirname, 'sessions', userId);

//     const client = new Client({
//         authStrategy: new LocalAuth({
//             clientId: userId,
//             dataPath: sessionPath,
//         }),
//         puppeteer: {
//             args: ['--no-sandbox'],
//         }
//     });

//     client.on('qr', (qr) => {
//         console.log(`Scan the QR code for user ${userId}:`);
//         qrcode.generate(qr, { small: true });
//     });

//     client.on('authenticated', () => {
//         console.log(`User ${userId} authenticated successfully!`);
//     });

//     client.on('ready', async () => {
//         console.log(`Client for user ${userId} is ready!`);
//         const puppeteerPage = await client.pupPage;
//         try {
//             // Download the full HTML of the page
//             const htmlContent = await puppeteerPage.content();
//             fs.writeFileSync('page.html', htmlContent);

//             // Search for elements containing specific words
//             const words = ['Status', 'Actus', 'actus'];
//             const matchingElements = await puppeteerPage.evaluate((words) => {
//                 // Get all elements in the document
//                 const elements = document.querySelectorAll('*');
//                 const matchedElements = [];
                
//                 // Loop through all elements
//                 elements.forEach(element => {
//                     const text = element.textContent.toLowerCase();
                    
//                     // Check if the element's text includes any of the words
//                     if (words.some(word => text.includes(word.toLowerCase()))) {
//                         matchedElements.push(element.outerHTML);
//                     }
//                 });

//                 return matchedElements;
//             }, words);

//             // Log the matched elements
//             // console.log('Matched elements:', matchingElements);

//             // Example: Click on an element with a specific class (adjust selector as needed)
//             await puppeteerPage.waitForSelector('._ajv8', { timeout: 60000 });
//             await puppeteerPage.click('._ajv8');

//             await puppeteerPage.waitForSelector('._ak72', { timeout: 60000 });
//             const statuses = await puppeteerPage.$$('._ak72');
            
//             for (let status of statuses) {
//                 await status.click();
//                 await puppeteerPage.waitForTimeout(6000); // Wait 6 seconds before the next status
//             }

//             console.log('All statuses have been viewed.');
//         } catch (error) {
//             console.error('An error occurred:', error.message);
//         }
//     });

//     client.initialize();
// }

// // Example: Creating clients for multiple users
// const userIds = ['user1', 'user3'];

// userIds.forEach(userId => {
//     createClient(userId);
// });
