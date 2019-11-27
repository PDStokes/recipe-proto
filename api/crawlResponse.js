import axios from 'axios';
import express from 'express';
import bodyParser from 'body-parser';

const crawl = express();
crawl.use(bodyParser.json());

crawl.put('/', async (req, res) => {

    const { queryUrl } = req.body;

    try {
        const response = await axios.get(queryUrl);
        res.status(200).send(response.data);
    } catch (error) {
        console.error(error);
        res.status(404).send(error);
    }

});

// Export the server middleware
export default {
    path: '/recipe',
    handler: crawl,
};
