<template>
    <div class="container">
        <div class="header">
            <h1 class="title">Reci<span>peel</span></h1>
            <form id="searchForm" ref="searchForm" @submit.prevent="crawlSite">
                <input
                    v-model="searchParam"
                    :disabled="loading"
                    type="text"
                    name="text"
                    class="inputField"
                    :class="{ 'loadingBar': loading }"
                    placeholder="Input URL"
                    @focus="warning = false"
                >
            </form>
            <p v-if="warning" class="warning">{{ warning }}</p>
            <saved-list v-if="savedData.length" :content="savedData" />
        </div>
        <div v-if="bodyContent" class="content">
            <parsed-html :content="bodyContent" />
        </div>
    </div>
</template>

<script>
import parsedHtml from '~/components/parsed-html';
import savedList from '~/components/saved-list';

export default {
    components: {
        parsedHtml,
        savedList,
    },
    data() {
        return {
            searchParam: '',
            warning: false,
            loading: false,
        };
    },
    computed: {
        savedData() {
            return this.$store.state.savedRecipes;
        },
        bodyContent() {
            return this.$store.state.currentRecipe;
        },
    },
    created() {
        if (process.client) {
            this.$store.dispatch('forageSavedRecipes');
        }
    },
    methods: {
        urlCheck(url) {
            if (url.startsWith('http') || url.startsWith('www')) {
                this.warning = false;
                return true;
            } else {
                this.warning = 'Please enter a valid URL';
                return false;
            }
        },
        async crawlSite() {
            if (this.urlCheck(this.searchParam)) {
                this.loading = true;
                const queryUrl = this.searchParam.toString().includes('http') ? this.searchParam : 'http://' + this.searchParam;
                try {
                    const response = await this.$axios.$put('/recipe', { queryUrl });

                    if (response) {
                        const recipeContent = this.$parseHtml.parse(response);
                        this.$store.commit('setCurrentRecipe', recipeContent);
                    }
                    setTimeout(() => {
                        this.loading = false;
                    }, 500);
                } catch (error) {
                    console.error(error);
                    this.warning = 'URL Failed: Please try again, or contact ya BOI.';
                    this.loading = false;
                }
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
}

.header {
    width: 100%;
    padding-top: 60px;
    padding-bottom: 100px;
}

.title {
    font-size: 3rem;
    color:yellowgreen;

    span {
        color:goldenrod;
    }
}

.inputField {
    width: 90%;
    max-width: 600px;
    padding: 10px;
    background-color: lightgray !important;
    outline: 0;
    border: 1px solid gray;
    font-size: 1.5rem;
}

.warning {
    color: red;
}

.loading {
    padding-top: 20px;
}

.content {
    margin-top: 40px;
    text-align: left;
    width: 100%;
    background-color: var(--gray-bg);
    border-top: 1px solid var(--gray-border);
    position: relative;
}

</style>
