const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());

app.post('/gemini', async (req, res) => {
    try {
        const userPrompt = req.body.prompt;
        const apiKey = req.body.apiKey;

        if (!userPrompt || !apiKey) {
            return res.status(400).json({ error: { message: "Faltan el prompt o la API key." } });
        }

        // Usamos el modelo v1beta optimizado para texto plano que acepta cualquier key estándar
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

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
        res.status(500).json({ error: { message: error.message } });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
