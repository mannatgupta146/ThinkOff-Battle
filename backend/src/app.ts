import e from 'express';
import express from 'express';
import useGraph from './services/graph.service.js'

const app = express();

app.get('/health', (req, res) => {
    res.send('ThinkOff Battle Backend is running!');
});

app.use(express.json());

app.post('/use-graph', async (req, res) => {
    await useGraph("wap to give factorail of a number in js")
});

export default app;