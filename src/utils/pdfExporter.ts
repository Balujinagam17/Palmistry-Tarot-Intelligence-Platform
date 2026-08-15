import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportReportToPDF(
  elementId: string,
  fileName = 'Palmistry_Tarot_Intelligence_Report.pdf'
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Report element with ID #${elementId} not found`);
  }

  // Temporary canvas rendering with html2canvas
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#080b14',
    logging: false,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pdfWidth;
  const imgHeight = (canvas.height * pdfWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pdfHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;
  }

  pdf.save(fileName);
}

export function exportReportToJSON(reportData: unknown, fileName = 'reading_data.json'): void {
  const jsonStr = JSON.stringify(reportData, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
