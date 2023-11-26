const puppeteer = require('puppeteer')
//import {Browser} from 'puppeteer'

const url = "https://www.bondsupermart.com/bsm/general-search/Apple"

const main = async (term) => {
    const browser = await puppeteer.launch();
    const [page] = await browser.pages();
    
    await page.setViewport({ width: 1920, height: 1080 });

    await page.goto('https://www.bondsupermart.com/bsm/general-search/'+term, { waitUntil: 'networkidle0' });
    const data = await page.evaluate(() => document.querySelector('.ant-table').outerHTML);

    await browser.close();
    //console.log(data)

    return data;
}

module.exports = main;