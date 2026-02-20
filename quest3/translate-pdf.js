const pdf = require('pdf-parse');
const { translate } = require('@vitalets/google-translate-api');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');

async function translatePDF(inputPath, outputPath) {
  console.log('Step 1: Extracting text from Korean PDF...');
  const pdfBuffer = fs.readFileSync(inputPath);
  const pdfData = await pdf(pdfBuffer);
  const koreanText = pdfData.text;
  console.log('Extracted:', koreanText.substring(0, 200));

  console.log('Step 2: Translating to English...');
  const { text: englishText } = await translate(koreanText, { to: 'en' });
  console.log('Translated:', englishText.substring(0, 200));

  console.log('Step 3: Writing translated text into new PDF...');
const pdfDoc = await PDFDocument.create();
const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
let page = pdfDoc.addPage();
const { width, height } = page.getSize();
const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
const header = [
  '='.repeat(60),
  '   TRANSLATED FROM KOREAN TO ENGLISH',
  `   Original file: ${inputPath}`,
  `   Translated on: ${date}`,
  '='.repeat(60),
  '',
].join('\n');

const cleanText = header + englishText.replace(/[^\x20-\x7E\n]/g, ' ');
const lines = cleanText.match(/.{1,90}/g) || [];
let y = height - 50;

  for (const line of lines) {
    if (y < 50) {
      page = pdfDoc.addPage();
      y = page.getSize().height - 50;
    }
    page.drawText(line, { x: 50, y, size: 11, font, color: rgb(0, 0, 0) });
    y -= 18;
  }

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputPath, pdfBytes);
  console.log(`Translated PDF saved: ${outputPath}`);
}

translatePDF('korean.pdf', 'translated.pdf');