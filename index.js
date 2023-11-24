const app = require("express")();

let chrome = {};
let puppeteer;

if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
  chrome = require("chrome-aws-lambda");
  puppeteer = require("puppeteer-core");
} else {
  puppeteer = require("puppeteer");
}

app.get("/api", async (req, res) => {
  const { term } = req.query;

  if (!term) {
    return res.status(400).json({ error: "Missing 'term' parameter" });
  }
  let options = {};

  if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    options = {
      args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
      defaultViewport: { width: 1920, height: 1080 },
      executablePath: await chrome.executablePath,
      headless: true,
      ignoreHTTPSErrors: true,
    };
  }

  try {
    let browser = await puppeteer.launch(options);

    const [page] = await browser.pages();
    await page.setViewport({ width: 1920, height: 1080 });

    await page.goto('https://www.bondsupermart.com/bsm/general-search/'+term, { waitUntil: 'networkidle0' });
    const data = await page.evaluate(() => document.querySelector('.ant-table').outerHTML);

    await browser.close();
    console.log(data)

    res.send(data);
  } catch (err) {
    console.error(err);
    return null;
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started");
});

module.exports = app;
