const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const pathToPhaser = path.join(__dirname, '/node_modules/phaser/');
const phaser = path.join(pathToPhaser, 'dist/phaser.js');

module.exports = {
    entry: './src/quarantine-client/game.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {test: /\.ts$/, loader: 'ts-loader', exclude: '/node_modules/'},
            {test: /phaser\.js$/, loader: 'expose-loader?Phaser'}
        ]
    },
    devServer: {
        contentBase: path.resolve(__dirname, './dist/'),
        host: '127.0.0.1',
        port: 8080,
        open: true
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            phaser: phaser
        }
    },
    performance: {
        hints: "warning"
    },
    plugins: [
        new CopyPlugin([ //TODO Could crash because of asset copying
            //{ from: path.resolve(__dirname, 'src/quarantine-client/assets'), to: 'assets' },
            { from: path.resolve(__dirname, 'index.html'), to: 'index.html' },
        ]),
    ],
};
