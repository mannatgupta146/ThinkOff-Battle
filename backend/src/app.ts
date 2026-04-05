import e from 'express';
import express from 'express';
import runGraph from './services/graph.service.js';

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
    res.send('ThinkOff Battle Backend is running!');
});

app.get('/use-graph', async (req, res) => {
    const result = await runGraph('Write a Js function to check if a number is prime.');
    res.json(result);
});

export default app;