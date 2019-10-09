import Vue from 'vue';
import cheerio from 'cheerio';

/** -----------------------------------
 * @desc Main plugin func that handles cheerio obj load, calls recipe search funcs, and returns recipe data object
 * @param String data - String of html page passed from GET response
 * @return Object - recipe data object
 */
const mainFunc = (data) => {
    const cheerioObj = cheerio.load(data);

    try {
        const recipeContainer = getContainer(cheerioObj);
        const recipe = {
            title: getTitle(cheerioObj, recipeContainer),
            ingredients: getIngredients(cheerioObj, recipeContainer),
            directions: getDirections(cheerioObj, recipeContainer),
        };
        return recipe;
    } catch (error) {
        console.error('Main Func Failed');
        console.error(error);
    }
};

/** -----------------------------------
 * @desc Func to determine best recipe container element and return it
 * @param Object O -Cheerio obj with loaded data
 * @return Object - cheerio element node
 */
const getContainer = (O) => {

    const containerClassSheet = ['recipe'];

    const container = domScrapeSort(O, containerClassSheet, {
        searchElemType: 'div',
        conditionName: 'container',
        listCheck: true,
    });

    return container;
};

/** -----------------------------------
 * @desc Func to return title
 * @param Object O - Cheerio obj with loaded data
 * @param Object containerElem - Cheerio obj of container
 * @return String - text of title element
 */
const getTitle = (O, containerElem) => {

    const titleClassSheet = ['title','name'];

    const title = domScrapeSort(O, titleClassSheet, {
        containerElem,
        conditionName: 'title',
    });

    return O(title).text();
};

/** -----------------------------------
 * @desc Func to return ingredients list
 * @param Object O - Cheerio obj with loaded data
 * @param Object containerElem - Cheerio obj of container
 * @return Array - array of strings with ingredients data
 */
const getIngredients = (O, containerElem) => {

    const ingredientsClassSheet = ['ingredient'];

    const ingredients = domScrapeSort(O, ingredientsClassSheet, {
        searchElemType: 'ul',
        containerElem,
        conditionName: 'list',
        listCheck: true,
    });

    const ingredientArr = parseLists(O, ingredients);

    return ingredientArr;
};

/** -----------------------------------
 * @desc Func to return directions list
 * @param Object O - Cheerio obj with loaded data
 * @param Object containerElem - Cheerio obj of container
 * @return Array - array of strings with directions data
 */
const getDirections = (O, containerElem) => {

    const directionsClassSheet = ['direction', 'instruction'];

    const directions = domScrapeSort(O, directionsClassSheet, {
        searchElemType: 'ul',
        containerElem,
        conditionName: 'list',
        listCheck: true,
    });

    const ingredientArr = parseLists(O, directions);

    return ingredientArr;
};

/** -----------------------------------
 * @desc Scraping function that handles DOM traversal and sorting based on params
 * @param Object O - Cheerio obj with loaded data
 * @param Array classList - Array of strings for searchable class names
 * @param Object options - Options object containing specific params for how to traverse/search and what to return
 * @return Object - cheerio element node
 */
const domScrapeSort = (O, classList, options) => {

    //Merge passed options and defaults
    const defaults = {
        searchElemType: '',
        containerElem: false,
        conditionName: isRequired,
        listCheck: false,
    };
    options = Object.assign(defaults, options);

    classList.filter( elem => elementExists(O, elem, options.containerElem));

    if (classList) {
        const bestMatchedElems = [];

        classList.forEach((className) => {
            let elemList;
            const verifiedElems = [];

            if (options.containerElem) {
                elemList = O(options.containerElem).find(`${options.searchElemType}[class*="${className}"]`).toArray();
            } else {
                elemList = O(`${options.searchElemType}[class*="${className}"]`).toArray();
            }

            O(elemList).each(function(i, elem) {
                const conditionPassed = conditionCheck(O, elem, options.conditionName);
                if (conditionPassed) {
                    verifiedElems.push(elem);
                }
            });

            if (verifiedElems) {
                const sortedElems = elemSort(O, verifiedElems, options.listCheck);
                bestMatchedElems.push(sortedElems[0]);
            } else {
                console.error(`No verified elems found for ${className}`);
            }

        });

        const finalElem = elemSort(O, bestMatchedElems, options.listCheck)[0];
        return finalElem;

    } else {
        throw new Error('No matched elements found after existCheck');
    }

};

// ----------- Tool Funcs ----------------

// Uses Cheerio obj to check if elem is in loaded data or inside parent elem
const elementExists = (O, elemName, parentElem = false) => {
    if (parentElem) {
        return O(parentElem).has(`[class*="${elemName}"]`);
    }
    return O(`[class*="${elemName}"]`);
};

// Error for required params
const isRequired = () => {
    throw new Error('param is required');
};

// Check and return Boolean based on funcs needs
const conditionCheck = (O, elem, conditionName) => {
    switch (conditionName) {
        case 'container':
            return O(elem).is('[class*="container"]');
        case 'title':
            return O(elem).children().length <= 2;
        case 'list':
            return O(elem).children().length >= 2;
        default:
            throw new Error('Incorrect condition check name');
    }
};


// Sort based on param type
const elemSort = (O, elems, listCheck = false) => {
    const sortType = listCheck ? listElemCheck : childrenCheck;
    const orderedArr = elems.sort( (a, b) => {
        const aCount = sortType(O, a);
        const bCount = sortType(O, b);

        if (listCheck) {
            return greatestFirstSort(aCount.length, bCount.length);
        } else {
            return leastFirstSort(aCount.length, bCount.length);
        }
    });
    return orderedArr;
};

// Return number of times string matches with '<li'
const listElemCheck = (O, elem) => {
    const regex = /(<li)+/g;
    const count = (O(elem).html()).match(regex);
    return (count === null ? 0 : count);
};

// Return number of times string matches with '<li'
const childrenCheck = (O, elem) => {
    return O(elem).children();
};

// Return for sort func based on greatest [greatestVal,... , lowestVal]
const greatestFirstSort = (a, b) => {
    if (a > b) {
        return -1;
    } else if (a < b) {
        return 1;
    }
    return 0;
};

// Return for sort func based on smallest val [lowestVal,... , greatestVal]
const leastFirstSort = (a, b) => {
    if (a > b) {
        return 1;
    } else if (a < b) {
        return -1;
    }
    return 0;
};

// Return array of strings from passed list elem
const parseLists = (O, listElem) => {
    const listArr = [];

    O(listElem).find('li').each(function(i, elem) {
        listArr.push( O(elem).text() );
    });

    if (listArr.length) {
        return listArr;
    } else {
        throw new Error('Unable to parse list object');
    }
};

// -----------------------------------

Vue.prototype.$parseHtml = mainFunc;
