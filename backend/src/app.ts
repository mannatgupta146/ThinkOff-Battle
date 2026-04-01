import e from 'express';
import express from 'express';

const app = express();

app.get('/health', (req, res) => {
    res.send('ThinkOff Battle Backend is running!');
});

export default app;