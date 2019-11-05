<template>
    <div v-if="content" class="recipe-wrapper">
        <div class="button-save" @click="saveRecipe"><i class="far fa-save" /> Save</div>
        <h1>{{ content.title }}</h1>
        <h2 class="subheader">Ingredients</h2>
        <ul class="ingredients">
            <li
                v-for="ingredient in content.ingredients"
                :key="ingredient.text"
                :class="{ 'list-header': ingredient.header }"
            >
                {{ ingredient.text }}
            </li>
        </ul>
        <h2 class="subheader">Directions</h2>
        <div class="direction-wrapper">
            <ol class="directions">
                <li
                    v-for="direction in content.directions"
                    :key="direction.text"
                    :class="{ 'list-header': direction.header }"
                >
                    {{ direction.text }}
                </li>
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
    methods: {
        saveRecipe() {
            this.$store.commit('addRecipe', this.content);
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
    position: relative;
}

ul, ol {
    margin-bottom: 3rem;
}

.subheader {
    text-decoration: underline;
}

.ingredients {
    padding-left: 1rem;

    li {
        margin-bottom: 0.5rem;
    }

    .list-header {
        list-style: none;
        font-weight: bold;
        margin-top: 2rem;
        margin-left: -1rem;
    }
}

.directions {
    padding-left: 0;
    counter-reset: section;

    li {
        list-style: none;
        position: relative;
        margin-bottom: 1rem;
        padding-left: 1.5rem;

        span {
            font-weight: normal;
        }

        &::before {
            counter-increment: section;
            content: counter(section) ". ";
            position: absolute;
            left: 0;
        }
    }

    .list-header {
        counter-reset: section -1;
        font-weight: bold;
        margin-top: 2rem;
        padding-left: 0;

        &::before {
            content: '';
        }
    }
}

.button-save {
    position: absolute;
    top: 30px;
    right: 0;
    padding: 5px 15px;
    border: 1px solid black;
    border-radius: 5px;
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.05);

    &:hover{
        background-color: rgba(0, 0, 0, 0.1);
    }
}
</style>
