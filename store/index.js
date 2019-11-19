import localforage from 'localforage';
import Vue from 'vue';

if (process.client) {
    localforage.config({
        driver: [localforage.INDEXEDDB,
            localforage.WEBSQL,
            localforage.LOCALSTORAGE],
        name: 'Recipeel-DB',
    });
}


export const state = () => ({
    savedRecipes: [],
    currentRecipe: null,
});

export const mutations = {
    addRecipe (state, recipe) {
        const truthy = state.savedRecipes.find((elem) => { return elem.title === recipe.title; });
        if (typeof truthy === 'undefined'){
            state.savedRecipes.push(recipe);
        }
    },
    removeRecipe (state, recipe) {
        const index = state.savedRecipes.indexOf(recipe);
        state.savedRecipes.splice(index, 1);

        localforage.getItem('savedRecipes').then(function(recipes) {
            const isRecipeSaved = recipes.find((elem) => { return elem.title === recipe.title; });
            if (isRecipeSaved) {
                localforage.setItem('savedRecipes', state.savedRecipes).catch(function(err) {
                    console.error("localforage setItem() failed");
                    console.error(err);
                });
            }
        }).catch(function(err) {
            console.error("localforage getItem() failed");
            console.log(err);
        });
    },
    focusRecipe (state, recipe) {
        if (state.savedRecipes.includes(recipe) && recipe !== state.currentRecipe){
            state.currentRecipe = recipe;
        }
    },
    setCurrentRecipe (state, recipe) {
        state.currentRecipe = recipe;
    },
    setRecipes (state, recipes) {
        recipes.forEach((recipe) => {
            recipe.saved = true;
        });
        state.savedRecipes = recipes;
    },
    removeAllRecipes (state) {
        state.savedRecipes = [];
    },
    addSavedIcons (state) {
        state.savedRecipes.forEach((recipe) => {
            Vue.set(recipe, 'saved', true);
        });
    },
};

export const actions = {
    saveCurrentRecipes ({ state, commit }) {
        commit('addSavedIcons');
        localforage.setItem('savedRecipes', state.savedRecipes).then(function(val) {
        }).catch(function(err) {
            console.error("localforage setItem() failed");
            console.error(err);
        });
    },
    clearCurrentRecipes ({ commit }) {
        localforage.clear().then(function() {
            console.log('Database is now empty.');
            commit('removeAllRecipes');
        }).catch(function(err) {
            console.error("localforage clear() failed:");
            console.error(err);
        });
    },
    forageSavedRecipes ({ commit }) {
        localforage.ready().then(function() {
            localforage.getItem('savedRecipes').then((value) => {
                if (value === null) {
                    console.log("localforage returned null");
                } else {
                    console.log("Loading:");
                    console.table(value);
                    commit('setRecipes', value);
                }
            }).catch((err) => {
                console.error("localforage getItem() failed:");
                console.error(err);
                state.savedRecipes = [];
            });
        }).catch(function (err) {
            console.error("localforage failed to load:");
            console.error(err);
        });
    },

};
