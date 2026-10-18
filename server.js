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

        // 1. Primero consultamos qué modelos soporta tu API key exactamente
        const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        const listRes = await fetch(listUrl);
        const listData = await listRes.json();

        let targetModel = "models/gemini-1.5-flash"; // Por defecto

        if (listData.models) {
            // Buscamos el primer modelo disponible que sirva para generar contenido
            const found = listData.models.find(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent"));
            if (found) {
                targetModel = found.name; // Ej: "models/gemini-1.5-flash" o "models/gemini-1.5-pro"
            }
        }

        console.log("Modelo seleccionado automáticamente:", targetModel);

        // 2. Ejecutamos la petición con el modelo que sabemos que sí acepta tu key
        const url = `https://generativelanguage.googleapis.com/v1beta/${targetModel}:generateContent?key=${apiKey}`;

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
        console.error("Error:", error);
        res.status(500).json({ error: { message: error.message } });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
