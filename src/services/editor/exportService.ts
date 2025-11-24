export const exportAsMarkdown = (content: string, filename: string = 'slide.md'): void => {
    const blob = new Blob([content], { type: 'text/markdown' });
    downloadBlob(blob, filename);
};

export const exportAsHTML = (htmlContent: string, filename: string = 'slide.html'): void => {
    const fullHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Slide Exportado</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      line-height: 1.6;
      color: #e2e8f0;
      background: #0f172a;
    }
    h1, h2, h3, h4, h5, h6 {
      color: #f1f5f9;
      margin-top: 1.5em;
      margin-bottom: 0.5em;
    }
    code {
      background: #1e293b;
      padding: 0.2em 0.4em;
      border-radius: 0.25rem;
      font-family: 'Courier New', monospace;
    }
    pre {
      background: #1e293b;
      padding: 1rem;
      border-radius: 0.5rem;
      overflow-x: auto;
    }
    a {
      color: #60a5fa;
    }
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html' });
    downloadBlob(blob, filename);
};

export const exportAsTXT = (content: string, filename: string = 'slide.txt'): void => {
    const textContent = content
        .replace(/#{1,6}\s+/g, '') // Remove headers
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
        .replace(/\*(.*?)\*/g, '$1') // Remove italic
        .replace(/`(.*?)`/g, '$1') // Remove inline code
        .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links
        .replace(/!\[(.*?)\]\(.*?\)/g, '$1'); // Remove images

    const blob = new Blob([textContent], { type: 'text/plain' });
    downloadBlob(blob, filename);
};

export const exportAsXLS = (content: string, filename: string = 'slide.csv'): void => {
    const lines = content.split('\n').filter(line => line.trim());
    const csvContent = lines.map(line => {
        const cleanLine = line
            .replace(/#{1,6}\s+/g, '')
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\*(.*?)\*/g, '$1')
            .replace(/`(.*?)`/g, '$1')
            .replace(/\[(.*?)\]\(.*?\)/g, '$1')
            .replace(/!\[(.*?)\]\(.*?\)/g, '$1')
            .replace(/^[-*+]\s+/, '')
            .replace(/^\d+\.\s+/, '');
        return `"${cleanLine.replace(/"/g, '""')}"`;
    }).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob, filename);
};

export const exportAsPDF = (htmlContent: string): void => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        alert('Por favor, permita pop-ups para exportar como PDF');
        return;
    }

    printWindow.document.write(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Slide Exportado</title>
  <style>
    @media print {
      @page {
        margin: 2cm;
      }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      line-height: 1.6;
      color: #1e293b;
    }
    h1, h2, h3, h4, h5, h6 {
      color: #0f172a;
      margin-top: 1.5em;
    }
    code {
      background: #f1f5f9;
      padding: 0.2em 0.4em;
      border-radius: 0.25rem;
    }
    pre {
      background: #f1f5f9;
      padding: 1rem;
      border-radius: 0.5rem;
      overflow-x: auto;
    }
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>`);

    printWindow.document.close();
    setTimeout(() => {
        printWindow.print();
    }, 250);
};

const downloadBlob = (blob: Blob, filename: string): void => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};
