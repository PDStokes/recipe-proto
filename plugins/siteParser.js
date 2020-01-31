import Vue from 'vue';
import cheerio from 'cheerio';

/** -----------------------------------
 * @desc Main plugin func that handles cheerio obj load, calls recipe search funcs, and returns recipe data object
 * @param String data - String of html page passed from GET response
 * @return Object - recipe data object
 */

function mainFunc () {
    let cheerioObj;

    function loadData(data) {
        cheerioObj = cheerio.load(data);
        return parseHtml();
    }

    function parseHtml() {
        try {
            const recipeContainer = getContainer(cheerioObj);
            const recipe = {
                title: getTitle(cheerioObj, recipeContainer),
                ingredients: getIngredients(cheerioObj, recipeContainer),
                directions: getDirections(cheerioObj, recipeContainer),
            };
            return recipe;
        } catch (error) {
            throw error;
        }
    }

    const api = {
        parse: loadData,
    };

    return api;
}

/** -----------------------------------
 * @desc Func to determine best recipe container element and return it
 * @param Object O -Cheerio obj with loaded data
 * @return Object - cheerio element node
 */
const getContainer = (O) => {

    const containerClassSheet = ['recipe'];

    const container = domScrapeSort(O, containerClassSheet, {
        searchElemType: ['div'],
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
        searchElemType: ['h1', 'h2', 'h3', 'div'],
        containerElem,
        conditionName: 'title',
    });

    return O(title[0]).text();
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
        searchElemType: ['ul'],
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

    const directionsClassSheet = ['direction', 'instruction', 'method'];

    const directions = domScrapeSort(O, directionsClassSheet, {
        searchElemType: ['ol', 'ul'],
        containerElem,
        conditionName: 'list',
        listCheck: true,
    });

    const directionArr = parseLists(O, directions);

    return directionArr;
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
        searchElemType: [''],
        containerElem: false,
        conditionName: isRequired,
        listCheck: false,
        debug: false,
    };
    options = Object.assign(defaults, options);

    // Check if element exists in loaded data or container obj
    classList.filter( elem => elementExists(O, elem, options.containerElem));

    if (classList.length) {
        const bestMatchedElems = [];

        // For each class name supplied in classList
        classList.forEach((className) => {
            let elemList = [];
            const verifiedElems = [];

            // Create array of elems that match class name OR child of matched class name with correct elem type
            options.searchElemType.forEach((elemType) => {
                elemList.push( findElemType(O, elemType, className, options) );
            });
            elemList = elemList.flat();

            if(options.debug) consoleGroup(className, 'Elemlist', elemList);

            // For each matched elem, perform condition check based on passed condition type (conditionName), if passes then push to verified
            O(elemList).each(function(i, elem) {
                const conditionPassed = conditionCheck(O, elem, options.conditionName);
                if (conditionPassed) {
                    verifiedElems.push(elem);
                }
            });

            if(options.debug) consoleGroup(className, 'Verified Elems', verifiedElems);

            // If verifiedElems recieved items, Sort all verified elems based on passed sort type (listCheck), and push best elem from top
            if (verifiedElems.length) {
                const sortedElems = elemSort(O, verifiedElems, options.listCheck);
                const topElemClass = O(sortedElems[0]).attr('class');

                // If multiple elements with same class name exist, push them all, otherwise push first/best
                if ( O(`.${topElemClass}`).length > 1 ) {
                    bestMatchedElems.push( O(`.${topElemClass}`).toArray() );
                } else {
                    bestMatchedElems.push(sortedElems[0]);
                }

            } else if (options.debug) {
                console.error(`No verified elems found for ${className}`);
            }

        });

        if(options.debug) consoleGroup('END', 'Best Matched Elems:', bestMatchedElems);

        // Sort of final best elems from each class name
        const finalElem = elemSort(O, bestMatchedElems.flat(), options.listCheck, true);
        return finalElem;

    } else {
        throw new Error('No matched elements found after existCheck');
    }

};

// ----------- Main Funcs ----------------

// Find and return correctly matched elements based on class name AND/OR elem type, and sort if necessary
const findElemType = (O, elemType, className, options) => {
    let matchedElems = [],
        matchedChildElems = [];

    switch (options.conditionName) {
        case 'container':
        case 'list':
            /* Find elems by container (if exists) && elem type + class name
            ------------------------------
                <Container Elem>
                    <ElemType className>
            ------------------------------
            */
            if (options.containerElem) {
                matchedElems = O(options.containerElem).find(`${elemType}[class*="${className}" i]`).toArray();
                matchedElems = setPriority(matchedElems, 1);
            } else {
                matchedElems = O(`${elemType}[class*="${className}" i]`).toArray();
                matchedElems = setPriority(matchedElems, 1);
            }

            /* If above fails, find parents by class name then match children by elem type
            ------------------------------
                <Container Elem>
                    <className>
                        <ElemType>
            ------------------------------
            */
            if (!matchedElems.length) {
                let parentElems = [];

                if (options.containerElem) {
                    parentElems = O(options.containerElem).find(`[class*="${className}" i]`).toArray();
                } else {
                    parentElems = O(`[class*="${className}" i]`).toArray();
                }

                parentElems.forEach( parent => {
                    const matchedElemType = O(parent).find(`${elemType}`).toArray();

                    if (matchedElemType.length) {
                        matchedChildElems.push( matchedElemType.flat() );
                    }
                });

                if (matchedChildElems.length) {
                    matchedElems = elemSort(O, matchedChildElems, options.listCheck);
                    matchedElems = setPriority(matchedElems, 2);
                }
            }

            /* If above fails, match all elem type inside container
            ------------------------------
                <Container Elem>
                    <ElemType>
            ------------------------------
            */
            // if (!matchedElems.length && !matchedChildElems.length) {
            //     let allElemTypes = [];
            //     if (options.containerElem) {
            //         allElemTypes = O(options.containerElem).find(`${elemType}`).toArray();
            //     } else {
            //         allElemTypes = O(`${elemType}`).toArray();
            //     }

            //     if (allElemTypes.length) {
            //         matchedElems = elemSort(O, allElemTypes, options.listCheck);
            //     }
            // }

            return matchedElems;
        case 'title':
            // Title always has container elem, so check <ElemType className>, and then just <ElemType> if nothing found
            matchedElems = O(options.containerElem).find(`${elemType}[class*="${className}" i]`).toArray();

            if (!matchedElems.length && elemType.startsWith('h')) {
                matchedElems = O(options.containerElem).find(`${elemType}`).toArray();
            }

            return matchedElems;
        default:
            throw new Error('Could not find viable elems for first check.');
    }
};

// Return array of strings from passed list elem
const parseLists = (O, listElem, debug = false) => {
    const listArr = [];
    const multiPart = O(listElem).length;

    if(debug) consoleGroup('PARSE', 'List ELEM', listElem);

    O(listElem).each(function(i, elem) {
        const elemType = O(elem).prev().length ? O(elem).prev().prop('nodeName').toLowerCase() : null;
        const headerTypes = ['h1', 'h2', 'h3', 'h4', 'h5'];

        if ( multiPart && headerTypes.includes(elemType) ) {
            listArr.push( { header: true, text: O(elem).prev().text() } );
        }

        O(elem).find('li').each(function(i, elem) {
            listArr.push( { header: false, text: O(elem).text() });
        });

    });

    if (listArr.length) {
        return listArr;
    } else {
        throw new Error('Unable to parse list object');
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
            return O(elem).is('[class*="container"]') || O(elem).children().length >= 3;
        case 'title':
            return O(elem).children().length <= 2;
        case 'list':
            return O(elem).children().length >= 2;
        default:
            throw new Error('Incorrect condition check name');
    }
};


// Sort based on param type
const elemSort = (O, elems, listCheck = false, prioritized = false) => {
    const sortType = listCheck ? listElemCheck : childrenCheck;
    if (prioritized) {
        elems = elems.sort( (a, b) => {
            const aPriority = a.priority;
            const bPriority = b.priority;

            return leastFirstSort(aPriority, bPriority);
        });
    }
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

// Return number of children
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

// Add priority property for better sorting
const setPriority = (elemList, priorityNum) => {
    if (elemList.length) {
        elemList.forEach((elem) => {
            elem.priority = priorityNum;
        });
    }
    return elemList;
};

// ----------- Debug Funcs ----------------

const consoleGroup = (className, name, data) => {
    console.group();
    console.info(`--${className}-- \n`);
    console.info(`${name}: \n`);
    console.info(data);
    console.groupEnd();
};

// ---------------------------------------

Vue.prototype.$parseHtml = mainFunc();
export default mainFunc();
