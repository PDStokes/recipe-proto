<template>
    <div class="saved-nav-wrapper">
        <div v-for="item in content" :key="item.title" class="save-item" @click="focusRecipe(item)">
            <span class="close-icon" @click="removeRecipe(item)"><i class="fas fa-times-circle" /></span>
            <p>{{ item.title }}</p>
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
        color: red;
    }
}
</style>
