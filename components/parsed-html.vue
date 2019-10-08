<template>
    <div v-if="content" class="recipe-wrapper">
        <h1>{{ content.title }}</h1>
        <h3>Ingredients</h3>
        <ul class="ingredients">
            <li v-for="ingredient in content.ingredients" :key="ingredient">{{ ingredient }}</li>
        </ul>
        <h3>Directions</h3>
        <div class="direction-wrapper">
            <p v-for="direction in content.directions" :key="direction" class="direction">{{ direction }}</p>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        content: {
            type: Object,
            default: null,
        },
    },
};
</script>

<style lang="scss" scoped>
.recipe-wrapper {
    width: fit-content;
    margin: 0 auto;
    max-width: 1000px;
}
</style>
