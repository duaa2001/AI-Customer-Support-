require('dotenv').config();
const axios = require('axios');
const pinecone = require('@pinecone-database/pinecone');

async function searchPinecone(query) {
    const apiKey = process.env.OPENAI_API_KEY;
    const model = 'text-embedding-ada-002';

    const response = await axios.post('https://api.openai.com/v1/embeddings', {
        input: query,
        model: model
    }, {
        headers: {
            'Authorization': `Bearer ${apiKey}`
        }
    });
    const queryEmbedding = response.data.data[0].embedding;

    const client = new pinecone.Client(process.env.PINECONE_API_KEY);
    const index = client.Index(process.env.INDEX_NAME);

    try {
        const result = await index.query({
            queries: [queryEmbedding],
            top_k: 5
        });
        console.log(result);
    } catch (error) {
        console.error('Error querying Pinecone:', error.message);
    }
}

// Example usage
searchPinecone('Your query here');
