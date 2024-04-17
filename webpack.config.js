import CopyWebpackPlugin from 'copy-webpack-plugin';
export default {
    entry: './src/index.js',
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: 'src/static', to: '.' },
            ],
        }),
    ],
}
