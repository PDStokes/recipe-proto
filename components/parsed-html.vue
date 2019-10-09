<template>
    <div v-if="content" class="recipe-wrapper">
        <h1>{{ content.title }}</h1>
        <h3>Ingredients</h3>
        <ul class="ingredients">
            <li v-for="ingredient in content.ingredients" :key="ingredient">{{ ingredient }}</li>
        </ul>
        <h3>Directions</h3>
        <div class="direction-wrapper">
            <ol class="directions">
                <li v-for="direction in content.directions" :key="direction" class="direction"><span>{{ direction }}</span></li>
            </ol>
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
    width: 80%;
    margin: 0 auto;
    max-width: 1000px;
    padding-top: 60px;
    padding-bottom: 80px;
}

.ingredients {
    li {
        margin-bottom: 0.5rem;
    }
}

.directions {
    font-weight: bold;

    li {
        margin-bottom: 1.5rem;

        span {
            font-weight: normal;
        }
    }
}
</style>
