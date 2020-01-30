import axios from 'axios';
import parser from '../../plugins/siteParser';

const testUrlList = [
    'https://thewoksoflife.com/garlic-chives-pork-cang-ying-tou/',
];

describe('Recipe URL snapshots', () => {
    testUrlList.forEach(url => {
        test(`${url}:`, async () => {
            const response = await axios.get(url);
            const parsedData = parser.parse(response.data);
            expect(parsedData).toMatchSnapshot();
        });
    });
});
