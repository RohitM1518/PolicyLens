import { jsPDF } from 'jspdf';

const processBoldText = (text) => {
  const boldPattern = /\*\*(.*?)\*\*/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = boldPattern.exec(text)) !== null) {
    // Add non-bold text before the match
    if (match.index > lastIndex) {
      parts.push({
        text: text.substring(lastIndex, match.index),
        isBold: false
      });
    }
    // Add bold text
    parts.push({
      text: match[1],
      isBold: true
    });
    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push({
      text: text.substring(lastIndex),
      isBold: false
    });
  }

  return parts;
};

const processListItem = (text) => {
  // Remove the bullet point marker and trim
  return text.replace(/^\*\s+/, '').trim();
};

export const generatePDF = (content, title = 'Summary') => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  const lineHeight = 7;
  let yPosition = margin;

  // Set title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(title, margin, yPosition);
  yPosition += lineHeight * 2;

  // Process content
  const lines = content.split('\n');
  doc.setFontSize(12);

  lines.forEach(line => {
    // Check if we need a new page
    if (yPosition > doc.internal.pageSize.height - margin) {
      doc.addPage();
      yPosition = margin;
    }

    // Handle bullet points
    const isBulletPoint = line.trim().startsWith('*');
    const processedLine = isBulletPoint ? processListItem(line) : line;
    const xPosition = isBulletPoint ? margin + 10 : margin;

    // Add bullet point
    if (isBulletPoint) {
      doc.setFont('helvetica', 'normal');
      doc.text('•', margin, yPosition);
    }

    // Process bold text
    const parts = processBoldText(processedLine);
    let currentX = xPosition;

    parts.forEach(part => {
      doc.setFont('helvetica', part.isBold ? 'bold' : 'normal');
      
      // Split long text to fit within page width
      const maxWidth = pageWidth - currentX - margin;
      const textLines = doc.splitTextToSize(part.text, maxWidth);
      
      textLines.forEach((textLine, index) => {
        if (index > 0) {
          yPosition += lineHeight;
          currentX = xPosition;
        }
        doc.text(textLine, currentX, yPosition);
        currentX += doc.getTextWidth(textLine);
      });
    });

    yPosition += lineHeight;
  });

  return doc;
};