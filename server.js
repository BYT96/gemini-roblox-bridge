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

        // Probemos con el modelo base gemini-1.0-pro que es el más antiguo y compatible con llaves de Google AI Studio
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: userPrompt }] }]
            })
        });

        const data = await response.json();
        
        // Imprimimos en la consola de Render la respuesta completa de Google para ver qué pasa
        console.log("Respuesta de Google:", JSON.stringify(data));

        res.json(data);

    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).json({ error: { message: error.message } });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
