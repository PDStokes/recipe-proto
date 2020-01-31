import axios from 'axios';
import parser from '../../plugins/siteParser';

const testUrlList = [
    'https://thewoksoflife.com/garlic-chives-pork-cang-ying-tou/',
    'https://www.mylatinatable.com/best-tacos-al-pastor-recipe/',
    'https://lovelylittlekitchen.com/best-ever-pumpkin-muffins/',
    'https://www.cleanandscentsible.com/chocolate-rice-krispie-gingerbread-men-pops/',
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
