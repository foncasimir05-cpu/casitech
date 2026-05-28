const { uploadImage } = require('../utils/cloudinary');
const fs = require('fs');
exports.uploadImage = async (req, res) => {
  try {
    const result = await uploadImage(req.file.path);
    fs.unlinkSync(req.file.path); // clean up local file
    res.json({ url: result.url, publicId: result.publicId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.analyzeImage = async (req, res) => {
  try {
    const { imageData, mediaType } = req.body;
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mediaType, data: imageData } },
            { type: 'text', text: `Analyze this electronics product image. Return ONLY a JSON object:\n{"name":"product name","cat":<1-10>,"price":<number>,"disc":<0-30>,"stock":<20-100>,"desc":"2-3 sentences","seller":"Casitech Store"}` }
          ]
        }]
      })
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};