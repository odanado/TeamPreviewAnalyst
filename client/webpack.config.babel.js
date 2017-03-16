import path from 'path';
import webpack from 'webpack';

const API_URL = {
    production: JSON.stringify('https://api.poyo.club/analyzer/upload'),
    development: JSON.stringify('https://test.poyo.club/analyzer/upload'),
};

const getEnvironment = () => {
    const env = process.env.NODE_ENV;
    if (env) {
        if (env === 'development') return 'development';
        return 'production';
    }
    return 'production';
};

const environment = getEnvironment();

export default {
    cache: true,
    entry: './src/app.jsx',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'client-bundle.js',
    },
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: [/node_modules/],
            },
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            API_URL: API_URL[environment],
        }),
    ],
    resolve: {
        extensions: ['*', '.js', '.jsx'],
    },
};
