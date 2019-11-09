<template>
    <div>
        <div class="saved-nav-wrapper">
            <div v-for="item in content" :key="item.title" class="save-item" @click="focusRecipe(item)">
                <span class="close-icon" @click="removeRecipe(item)"><i class="fas fa-times-circle" /></span>
                <p>{{ item.title }}</p>
            </div>
        </div>
        <div class="button-wrapper">
            <div class="storage-button save" @click="saveLocalStorage">
                Save for next time
            </div>
            <div class="storage-button close" @click="clearLocalStorage">
                Clear all for good
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        content: {
            type: Array,
            default: null,
        },
    },
    methods: {
        removeRecipe(recipe) {
            this.$store.commit('removeRecipe', recipe);
        },
        focusRecipe(recipe) {
            this.$store.commit('focusRecipe', recipe);
        },
        saveLocalStorage() {
            this.$store.dispatch('saveCurrentRecipes');
        },
        clearLocalStorage() {
            this.$store.dispatch('clearCurrentRecipes');
        },
    },
};
</script>

<style lang="scss" scoped>
.saved-nav-wrapper {
    background-color: var(--gray-bg);
    padding: 5px;
    border: 1px solid var(--gray-border);
    border-radius: 5px;
    width: 90%;
    max-width: 600px;
    margin: auto;
    margin-top: 40px;
}

.save-item {
    padding: 5px;
    border-bottom: 1px solid var(--gray-border);
    position: relative;
    cursor: pointer;

    &:last-child {
        border-bottom: none;
    }

    &:hover{
        background-color:rgba(0,0,0,0.05);
    }
}

.close-icon{
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 5px;
    font-size: 1.5rem;

    &:hover {
        color: darken(red, 15%);
    }
}

.button-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 30px;
}

.storage-button{
    width: fit-content;
    padding: 10px 20px;
    border: 1px solid var(--gray-border);
    border-radius: 5px;
    cursor: pointer;
    margin: 0 10px;

    &:hover{
        opacity: 0.75;
    }

    &.save {
        background-color: lighten(yellowgreen, 40%);
        border-color: darken(yellowgreen, 10%);
        color: darken(yellowgreen, 10%);
    }

    &.close {
        color: red;
        border-color: red;
        background-color: lighten(red, 45%);
    }
}
</style>
