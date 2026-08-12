export default async function handler(req, res) {
    // Разрешаем вашему сайту подключаться к этому мини-серверу
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message } = req.body;
    
    // Замаскированный чистый Web API Key (AIzaSyDu7UK7zc7K-ZwXFyRMc4LK9e_U9W5HLK0)
    const encoded_key = "QUl6YVN5RHU3VUs3emM3Sy1ad1hGeVJNYzRMSDllX1U5VzVITEsw";
    const GEMINI_API_KEY = atob(encoded_key);
    const GEMINI_URL = `https://googleapis.com{GEMINI_API_KEY}`;

    const SYSTEM_PROMPT = `Ты — персональный ИИ-дневник калорий и куратор по сушке для Андрея (30 лет, 179 см). 
    Его актуальный вес: 89,55 кг. Цель: 77-80 кг. 15 августа он улетает в Казахстан, задача сейчас — держать дефицит.
    ЖЕСТКИЕ ПРАВИЛА ЖКТ: У Андрея были сбои (спазмы, вздутие). Исключить лактозу на ночь, сырые огурцы микродозами. Тяжелую еду контролировать. При перегрузках напоминай принять 1-2 таб. Панкреатина.
    ПРАВИЛА ПОДСЧЕТА: Базовый лимит 2150 ккал, белок строго 160-180г. Если указано 'на двоих' или 'половина' — дели порцию пополам и считай только его КБЖУ.
    Отвечай четко, емко, считай КБЖУ каждого продукта и пиши итоговый статус за прием пищи. Общайся по-дружески, но профессионально.`;

    try {
        const response = await fetch(GEMINI_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\n\nПользователь пишет: ${message}` }] }]
            })
        });

        const data = await response.json();
        const aiText = data.candidates[0].content.parts[0].text;
        return res.status(200).json({ text: aiText });
    } catch (error) {
        return res.status(500).json({ error: 'Ошибка сервера при запросе к Gemini' });
    }
}
