<template>
    <div class="container">
        <div class="header">
            <h1 class="title">Reci<span>peel</span></h1>
            <form ref="searchForm" @submit.prevent="crawlSite">
                <input
                    v-model="searchParam"
                    :disabled="loading"
                    type="text"
                    name="text"
                    class="inputField"
                    placeholder="Input URL"
                    @focus="warning = false"
                >
            </form>
            <p v-if="warning" class="warning">{{ warning }}</p>
        </div>
        <div v-if="bodyContent" class="content">
            <parsed-html :content="bodyContent" />
        </div>
    </div>
</template>

<script>
import parsedHtml from '~/components/parsed-html';

export default {
    components: {
        parsedHtml,
    },
    data() {
        return {
            searchParam: '',
            warning: false,
            loading: false,
            bodyContent: null,
        };
    },
    methods: {
        urlCheck(url) {
            if (url === null || url === '') {
                this.warning = 'Please enter a valid URL';
                return false;
            } else {
                this.warning = false;
                return true;
            }
        },
        async crawlSite() {
            if (this.urlCheck(this.searchParam)) {
                this.loading = true;
                const baseUrl = this.searchParam.toString().includes('http') ? this.searchParam : 'http://' + this.searchParam;

                try {
                    const response = await this.$axios.$put('/recipe', { baseUrl });
                    if (response) {
                        this.bodyContent = this.$parseHtml(response);
                    }

                } catch (error) {
                    console.error("Error: " + error);
                    this.warning = 'URL Failed: Please try again, or contact ya BOI.';
                }
            }
            this.loading = false;
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
    background-color: lightgray;
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
    background-color: rgb(240, 240, 240);
    border-top: 1px solid rgb(220, 220, 220);
}

</style>
