import express from 'express';
import runGraph from './services/graph.service.js';
import cors from 'cors'

const app = express();
app.use(express.json());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}))

app.get('/health', (req, res) => {
    res.send('ThinkOff Battle Backend is running!');
});

app.get('/', async (req, res) => {
    const result = runGraph('Write a program of factorial of a number in js ')
    res.json(result)
})

app.get("/invoke", async (req, res) => {
    const { input } = req.body
    const result = await runGraph(input)

    res.status(200).json({
        success: true,
        message: 'Graph invoked successfully',
        data: result
    })
})

export default app;