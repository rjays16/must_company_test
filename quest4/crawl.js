const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs-extra');
const path = require('path');

const TARGET_URL = 'https://books.toscrape.com'; // sample site for testing
const LOG_FILE = path.join(__dirname, 'logs', 'crawl.log');
const DATA_FILE = path.join(__dirname, 'data', 'results.json');

function log(message) {
  const entry = `[${new Date().toISOString()}] ${message}`;
  console.log(entry);
  fs.appendFileSync(LOG_FILE, entry + '\n');
}

async function crawl() {
  log('Starting crawl...');
  log(`Target URL: ${TARGET_URL}`);

  try {
    const response = await axios.get(TARGET_URL, { timeout: 10000 });
    log(`Connected successfully. Status: ${response.status}`);

    const $ = cheerio.load(response.data);
    const results = [];

    // Extract data from the page
    $('article.product_pod').each((i, el) => {
      const title = $(el).find('h3 a').attr('title');
      const price = $(el).find('.price_color').text().trim();
      const rating = $(el).find('p.star-rating').attr('class').replace('star-rating ', '');
      const link = $(el).find('h3 a').attr('href');

      results.push({ title, price, rating, link });
    });

    log(`Extracted ${results.length} items`);

    // Save as JSON
    await fs.writeJson(DATA_FILE, results, { spaces: 2 });
    log(`Data saved to ${DATA_FILE}`);

    // Save as CSV
    const csvFile = path.join(__dirname, 'data', 'results.csv');
    const csvHeader = 'Title,Price,Rating,Link\n';
    const csvRows = results.map(r => `"${r.title}","${r.price}","${r.rating}","${r.link}"`).join('\n');
    fs.writeFileSync(csvFile, csvHeader + csvRows);
    log(`CSV saved to ${csvFile}`);

    log('Crawl completed successfully!');
    log(`Total items extracted: ${results.length}`);

  } catch (error) {
    log(`ERROR: ${error.message}`);
    if (error.code === 'ECONNREFUSED') log('Site is down or unreachable.');
    if (error.code === 'ETIMEDOUT') log('Connection timed out.');
    process.exit(1);
  }
}

crawl();