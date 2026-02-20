const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

async function mergePDFs(pdfAPath, pdfBPath, outputPath) {
  const pdfABytes = fs.readFileSync(pdfAPath);
  const pdfBBytes = fs.readFileSync(pdfBPath);

  const pdfA = await PDFDocument.load(pdfABytes);
  const pdfB = await PDFDocument.load(pdfBBytes);

  const mergedPdf = await PDFDocument.create();

  const pagesA = await mergedPdf.copyPages(pdfA, pdfA.getPageIndices());
  pagesA.forEach(page => mergedPdf.addPage(page));

  const pagesB = await mergedPdf.copyPages(pdfB, pdfB.getPageIndices());
  pagesB.forEach(page => mergedPdf.addPage(page));

  const mergedBytes = await mergedPdf.save();
  fs.writeFileSync(outputPath, mergedBytes);

  console.log(`Merged PDF saved: ${outputPath}`);
  console.log(`   File A pages: ${pdfA.getPageCount()}`);
  console.log(`   File B pages: ${pdfB.getPageCount()}`);
  console.log(`   Total pages:  ${pdfA.getPageCount() + pdfB.getPageCount()}`);
}

mergePDFs('fileA.pdf', 'fileB.pdf', 'merged.pdf');