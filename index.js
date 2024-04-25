const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/gdph', async (req, res) => {
    try {
        const { songlink, title, artist } = req.query;

        if (!songlink || !title || !artist) {
            return res.status(400).json({ error: 'Missing required parameters 🛡️' });
        }

        const url = 'https://gdph.ps.fhgdps.com/tools/songAdd.php';
        const formData = {
            songlink: songlink,
            name: title,
            authorName: artist
        };

        // Assuming that the form action is 'songAdd.php'
        const formAction = '/songAdd.php';

        const submitResponse = await axios.post(formAction, formData, {
            baseURL: 'https://gdph.ps.fhgdps.com/tools/songAdd.php',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0' // Set a user-agent header
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
