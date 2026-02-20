// Quest 1: RPA Crawling - Extract PDF from target website
// Target: ≤16 seconds (≤8 seconds ideal)

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function runRPA() {
  console.log('Starting Quest 1: RPA Crawling...');
  const startTime = Date.now();

  // TODO: Implement crawling logic
  // 1. Launch browser
  // 2. Navigate to target site
  // 3. Search for address
  // 4. Download PDF
  // 5. Save locally

  const elapsed = Date.now() - startTime;
  console.log(`Quest 1 completed in ${elapsed/1000} seconds`);
}

runRPA().catch(console.error);
