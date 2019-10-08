<template>
    <div class="container">
        <div class="header">
            <form ref="searchForm" @submit.prevent="crawlSite">
                <input
                    v-model="searchParam"
                    :disabled="disable"
                    type="text"
                    name="text"
                    class="inputField"
                    placeholder="Input URL"
                >
            </form>
            <p v-if="warning" class="warning" @focus="warning = false">{{ warning }}</p>
        </div>
        <div class="content">
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
            disable: false,
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
                this.disable = true;
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
            this.disable = false;
        },
    },
};
</script>

<style>
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
    padding-top: 150px;
    padding-bottom: 50px;
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

.content {
    margin-top: 40px;
    text-align: left;
    width: 100%;
    background-color: lightgray;
}

</style>
