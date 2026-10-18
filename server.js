const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());

app.post('/gemini', async (req, res) => {
    const userPrompt = req.body.prompt;
    const apiKey = req.body.apiKey;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: userPrompt }] }]
            })
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Activo en puerto ${PORT}`));
