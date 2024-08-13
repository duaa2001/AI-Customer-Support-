require('dotenv').config();
const fs = require('fs');
const axios = require('axios');

// Function to handle rate limiting and retry
async function fetchEmbeddings(textChunk) {
    const apiKey = process.env.OPENAI_API_KEY;
    const model = 'text-embedding-ada-002';
    const endpoint = 'https://api.openai.com/v1/embeddings';

    try {
        const response = await axios.post(endpoint, {
            input: textChunk,
            model: model
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });
        return response.data.data[0].embedding;
    } catch (error) {
        if (error.response && error.response.status === 429) { // Rate limit exceeded
            console.log('Rate limit exceeded, retrying...');
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait before retrying
            return fetchEmbeddings(textChunk); // Retry
        }
        console.error('Error generating embeddings:', error.message);
        return null;
    }
}

// Main function to read text chunks, generate embeddings, and save them
async function generateEmbeddings() {
    try {
        const chunks = JSON.parse(fs.readFileSync('textChunks.json', 'utf8'));
        const embeddings = [];

        for (const chunk of chunks) {
            const embedding = await fetchEmbeddings(chunk);
            if (embedding) {
                embeddings.push(embedding);
            }
        }

        fs.writeFileSync('embeddings.json', JSON.stringify(embeddings, null, 2));
        console.log('Embeddings generated and saved to embeddings.json');
    } catch (error) {
        console.error('Error processing embeddings:', error);
    }
}

// Run the script
generateEmbeddings();
