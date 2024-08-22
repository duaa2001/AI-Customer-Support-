require('dotenv').config();
const pinecone = require('@pinecone-database/pinecone');
const fs = require('fs');

async function indexEmbeddings(embeddings) {
    const client = new pinecone.Client(process.env.PINECONE_API_KEY);
    const index = client.Index(process.env.INDEX_NAME);

    const vectors = embeddings.map((embedding, i) => ({
        id: i.toString(),
        values: embedding
    }));

    try {
        await index.upsert(vectors);
        console.log('Embeddings indexed successfully');
    } catch (error) {
        console.error('Error indexing embeddings:', error.message);
    }
}

// Example usage
const embeddings = JSON.parse(fs.readFileSync('embeddings.json', 'utf8'));
indexEmbeddings(embeddings);
