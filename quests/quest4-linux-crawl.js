// Quest 4: Linux Crawling - Extract data using curl/wget/Scrapy/Selenium
// Output: JSON/CSV format with automation + error handling

const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function linuxCrawl() {
  console.log('Starting Quest 4: Linux Crawling...');
  const startTime = Date.now();

  // TODO: Implement Linux crawling
  // 1. Use curl/wget or Scrapy/Selenium
  // 2. Extract data (text, images, links)
  // 3. Automate with cron (note: Windows, but code should work on Linux)
  // 4. Handle errors (site downtime, connection issues)
  // 5. Output to JSON/CSV

  const elapsed = Date.now() - startTime;
  console.log(`Quest 4 completed in ${elapsed/1000} seconds`);
}

linuxCrawl().catch(console.error);
