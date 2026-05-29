const { uploadBuffer } = require('../utils/cloudinary');

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file provided' });
    console.log(`[upload] file=${req.file.originalname} size=${req.file.size} mime=${req.file.mimetype}`);
    console.log(`[upload] Cloudinary config: cloud_name=${process.env.CLOUDINARY_CLOUD_NAME} api_key=${process.env.CLOUDINARY_API_KEY ? '***set***' : 'MISSING'} api_secret=${process.env.CLOUDINARY_API_SECRET ? '***set***' : 'MISSING'}`);
    const result = await uploadBuffer(req.file.buffer, req.file.mimetype);
    console.log(`[upload] success url=${result.url}`);
    res.json({ url: result.url, publicId: result.publicId });
  } catch (err) {
    console.error(`[upload] Cloudinary error: ${err.message}`, err.http_code ? `HTTP ${err.http_code}` : '');
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