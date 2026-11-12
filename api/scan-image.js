export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageBase64, mimeType } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is missing on server' });
    }

    const prompt = `Extract all tabular data, handwritten notes, lists, or receipt items from this image and convert them into a clean, well-structured CSV format.
Rules:
1. Return ONLY raw CSV text. Do NOT include markdown formatting like \`\`\`csv or \`\`\`.
2. Do NOT add any explanation or extra text before or after the CSV.
3. Use a comma (,) as the delimiter and wrap values containing commas in double quotes.
4. Create clear, logical column headers in the first row if headers are missing.`;

    // यदि पहला मॉडल व्यस्त (high demand) हो, तो अपने आप अगले उपलब्ध मॉडल से कोशिश करेगा
    const models = ['gemini-3.8-flash-lite', 'gemini-3.8-flash', 'gemini-2.5-pro'];
    let lastError = 'AI service is busy, please try again.';

    for (const model of models) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    { text: prompt },
                    {
                      inline_data: {
                        mime_type: mimeType || 'image/jpeg',
                        data: imageBase64,
                      },
                    },
                  ],
                },
              ],
            }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          let csvText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          csvText = csvText.replace(/^```csv\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
          return res.status(200).json({ csv: csvText });
        }

        lastError = data.error?.message || lastError;
      } catch (e) {
        lastError = e.message || lastError;
      }
    }

    return res.status(503).json({ error: lastError });
  } catch (error) {
    console.error('Scan API Error:', error);
    return res.status(500).json({ error: 'Internal server error while scanning image' });
  }
}