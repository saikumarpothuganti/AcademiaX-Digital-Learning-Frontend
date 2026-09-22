const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    
    async function testDirect() {
        console.log('\n--- Testing Direct Login ---');
        const page = await browser.newPage();
        await page.goto('http://localhost:5173');
        await page.waitForSelector('input[type="text"]', { timeout: 5000 });
        
        await page.type('input[type="text"]', 'e2e_student_1');
        await page.type('input[type="password"]', 'Password123!');
        
        await page.click('button[type="submit"]');
        
        try {
            await page.waitForSelector('h1', { timeout: 5000 });
            const title = await page.evaluate(() => document.querySelector('h1').innerText);
            if (title.includes('Dashboard')) {
                console.log('Direct Login: PASS');
            } else {
                console.log('Direct Login: FAIL - Did not reach dashboard');
            }
        } catch (e) {
            console.log('Direct Login: FAIL - ' + e.message);
        }
        await page.close();
    }

    async function testProvider(name, buttonText) {
        console.log('\n--- Testing ' + name + ' SSO ---');
        const page = await browser.newPage();
        await page.goto('http://localhost:5173');
        await page.waitForSelector('button', { timeout: 5000 });
        
        const buttons = await page.$$('button');
        let clicked = false;
        for (const btn of buttons) {
            const text = await page.evaluate(el => el.innerText, btn);
            if (text.includes(buttonText)) {
                await btn.click();
                clicked = true;
                break;
            }
        }
        
        if (!clicked) {
            console.log(name + ' SSO: FAIL - Button not found');
            return;
        }

        try {
            await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 });
            const url = page.url();
            console.log('Redirected URL: ' + url);
            
            const body = await page.evaluate(() => document.body.innerText);
            if (body.includes('We are sorry') || body.includes('Internal Server Error')) {
                const errorElement = await page.$('#kc-error-message');
                let errorMsg = 'Unknown Keycloak Error';
                if (errorElement) {
                    errorMsg = await page.evaluate(el => el.innerText, errorElement);
                }
                console.log(name + ' SSO: FAIL - ' + errorMsg.trim());
            } else if (url.includes('google.com') || url.includes('microsoftonline.com') || url.includes('live.com')) {
                console.log(name + ' SSO: PASS (Reached provider)');
            } else {
                console.log(name + ' SSO: FAIL - Did not reach provider, current URL: ' + url);
            }
        } catch (e) {
            console.log(name + ' SSO: FAIL - ' + e.message);
        }
        await page.close();
    }

    await testDirect();
    await testProvider('Google', 'Google');
    await testProvider('Microsoft', 'Microsoft');

    await browser.close();
})();
