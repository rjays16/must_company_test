const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const LOG_FILE = path.join(__dirname, 'logs', 'crawl.log');
const DOWNLOAD_DIR = path.join(__dirname, 'downloads');

function log(message) {
  const entry = `[${new Date().toISOString()}] ${message}`;
  console.log(entry);
  fs.appendFileSync(LOG_FILE, entry + '\n');
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, res => {
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', err => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function crawl() {
  const start = Date.now();
  log('Starting crawl...');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

    log('Navigating to Naver Land...');
    await page.goto('https://land.naver.com', { waitUntil: 'networkidle2', timeout: 30000 });
    log('Page loaded successfully');

    // Find all PDF links on the page
    const pdfLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a[href*=".pdf"], a[href*="pdf"]'))
        .map(a => a.href)
        .filter(href => href && href.startsWith('http'));
    });

    log(`Found ${pdfLinks.length} PDF links`);

    if (pdfLinks.length === 0) {
      log('No PDFs found on main page — saving page screenshot and HTML instead');
      await page.screenshot({ path: path.join(DOWNLOAD_DIR, 'screenshot.png') });
      const html = await page.content();
      fs.writeFileSync(path.join(DOWNLOAD_DIR, 'page.html'), html);
      log('Screenshot and HTML saved to downloads folder');
    } else {
      for (const link of pdfLinks) {
        const filename = path.basename(link).split('?')[0] || 'file.pdf';
        const dest = path.join(DOWNLOAD_DIR, filename);
        await downloadFile(link, dest);
        log(`Downloaded: ${filename}`);
      }
    }

    const elapsed = ((Date.now() - start) / 1000).toFixed(2);
    log(`Crawl completed in ${elapsed} seconds`);

  } catch (error) {
    log(`ERROR: ${error.message}`);
  } finally {
    await browser.close();
  }
}

crawl();