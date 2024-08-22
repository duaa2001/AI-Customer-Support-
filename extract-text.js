require('dotenv').config();
const fs = require('fs');
const pdf = require('pdf-parse');

// Function to split text into chunks
function splitTextIntoChunks(text, chunkSize = 1000, chunkOverlap = 0) {
    const chunks = [];
    let start = 0;

    while (start < text.length) {
        const end = Math.min(start + chunkSize, text.length);
        chunks.push(text.slice(start, end));
        start = end - chunkOverlap;
    }

    return chunks;
}

async function extractTextFromPDF(pdfPath) {
    try {
        const dataBuffer = fs.readFileSync(pdfPath);
        const data = await pdf(dataBuffer);
        return data.text || ''; // Ensure it returns an empty string if no text
    } catch (error) {
        console.error('Error extracting text:', error);
        return null;
    }
}

// Example usage
extractTextFromPDF('app/docs/HeadstarterProject.pdf').then(text => {
    if (text) {
        const chunks = splitTextIntoChunks(text);
        fs.writeFileSync('textchunks.json', JSON.stringify(chunks, null, 2));
        console.log('Text chunks saved to textchunks.json');
    } else {
        console.log('No text extracted or an error occurred.');
    }
});