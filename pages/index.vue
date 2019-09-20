<template>
    <div class="container">
        <form ref="searchForm" @submit.prevent="crawlSite">
            <input v-model="searchParam" type="text" name="text" class="inputField" placeholder="Input URL">
        </form>
        <p v-if="warning" class="warning" @focus="warning = false">{{ warning }}</p>
        <p class="content">{{ bodyContent }}</p>
    </div>
</template>

<script>

export default {
    data() {
        return {
            searchParam: '',
            warning: false,
        };
    },
    asyncData() {
        return {
            bodyContent: '',
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
                const baseUrl = this.searchParam.toString().includes('http') ? this.searchParam : 'http://' + this.searchParam;

                try {
                    const response = await this.$axios.$put('/recipe', { baseUrl });
                    if (response) {
                        this.bodyContent = response;
                    }

                } catch (error) {
                    console.error("Error: " + error);
                    this.warning = 'URL Failed: Please try again.';
                }
            }
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
  justify-content: center;
  align-items: center;
  text-align: center;
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
}

</style>
