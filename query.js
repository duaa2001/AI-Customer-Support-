require('dotenv').config();
const pinecone = require('@pinecone-database/pinecone');
const axios = require('axios');

// Initialize Pinecone client
const client = new pinecone.Client(process.env.PINECONE_API_KEY);
const index = client.Index(process.env.INDEX_NAME);

// Function to query Pinecone
async function queryPinecone(queryText) {
    const apiKey = process.env.OPENAI_API_KEY;
    const model = 'text-embedding-ada-002';

    try {
        // Get embeddings for the query
        const response = await axios.post('https://api.openai.com/v1/embeddings', {
            input: queryText,
            model: model
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });
        const queryEmbedding = response.data.data[0].embedding;

        // Query Pinecone with the query embedding
        const queryResponse = await index.query({
            vector: queryEmbedding,
            topK: 5, // Number of similar documents to retrieve
            includeValues: true,
            includeMetadata: true
        });

        return queryResponse;
    } catch (error) {
        console.error('Error querying Pinecone:', error.message);
        return null;
    }
}

// Example usage
const queryText = 'Your query here';
queryPinecone(queryText).then(response => {
    if (response) {
        console.log('Query results:', response);
    } else {
        console.log('No results found or an error occurred.');
    }
});
