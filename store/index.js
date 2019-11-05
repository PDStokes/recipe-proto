export const state = () => ({
    savedRecipes: [],
    currentRecipe: null,
});

export const mutations = {
    addRecipe (state, recipe) {
        if (!state.savedRecipes.includes(recipe)){
            state.savedRecipes.push(recipe);
        }
    },
    removeRecipe (state, recipe) {
        const index = state.savedRecipes.indexOf(recipe);
        state.savedRecipes.splice(index, 1);
    },
    focusRecipe (state, recipe) {
        if (state.savedRecipes.includes(recipe) && recipe !== state.currentRecipe){
            state.currentRecipe = recipe;
        }
    },
    setCurrentRecipe (state, recipe) {
        state.currentRecipe = recipe;
    },
};
