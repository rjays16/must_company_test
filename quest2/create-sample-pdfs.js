const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

async function createSamples() {
  const pdfA = await PDFDocument.create();
  for (let i = 1; i <= 10; i++) {
    const page = pdfA.addPage();
    page.drawText(`File A - Page ${i}`, { x: 50, y: 500, size: 24 });
  }
  fs.writeFileSync('fileA.pdf', await pdfA.save());
  console.log('Created fileA.pdf (10 pages)');

  const pdfB = await PDFDocument.create();
  for (let i = 1; i <= 3; i++) {
    const page = pdfB.addPage();
    page.drawText(`File B - Page ${i}`, { x: 50, y: 500, size: 24 });
  }
  fs.writeFileSync('fileB.pdf', await pdfB.save());
  console.log('Created fileB.pdf (3 pages)');
}

createSamples();