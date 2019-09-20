module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": [
        '@nuxtjs',
        "eslint:recommended",
        'plugin:nuxt/recommended',
        'plugin:vue/recommended'
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "parser": 'babel-eslint',
        "sourceType": "module"
    },
    "plugins": [
        "vue"
    ],
    "rules": {
        "indent": [
            "error", 4, {
                "SwitchCase": 1
            }
        ],
        "no-console": "off",
        "comma-dangle": ["error", "always-multiline"],
        "semi": ["error", "always"],
        "vue/html-indent": ["error", 4],
        "vue/multiline-html-element-content-newline": ["error", {
            "ignores": ["pre", "textarea", "a", "nuxt-link"]
        }],
        "vue/singleline-html-element-content-newline": "off",
    }
};
