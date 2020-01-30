module.exports = function(api) {
    if (api.env("test")) {
        return {
            presets: [
                [
                    "@babel/preset-env",
                    {
                        modules: "commonjs",
                        targets: {
                            node: "current",
                        },
                    },
                ],
            ],
        };
    }
    return {};
};
