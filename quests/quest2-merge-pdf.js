// Quest 2: Merge PDFs - Combine 10-page + 3-page PDF = 13-page PDF

const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function mergePDFs() {
  console.log('Starting Quest 2: Merge PDFs...');
  const startTime = Date.now();

  // TODO: Implement PDF merging
  // 1. Load PDF A (10-page)
  // 2. Load PDF B (3-page)
  // 3. Merge into single document
  // 4. Save as output

  const elapsed = Date.now() - startTime;
  console.log(`Quest 2 completed in ${elapsed/1000} seconds`);
}

mergePDFs().catch(console.error);
