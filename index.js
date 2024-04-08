const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = 3000;

// Middleware to parse JSON and URL-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/gdph', async (req, res) => {
    try {
        const { songlink, title, artist } = req.query;

        if (!songlink || !title || !artist) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        const url = 'https://gdph.ps.fhgdps.com/tools/songAdd.php';
        const formData = {
            songlink: songlink,
            name: title,
            authorName: artist
        };

        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        const formAction = $('form').attr('action');

        const postData = formData;

        const submitResponse = await axios.post(formAction, postData, {
            baseURL: 'https://gdph.ps.fhgdps.com/tools/songAdd.php', // Set the baseURL
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });

        res.status(200).json(submitResponse.data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
