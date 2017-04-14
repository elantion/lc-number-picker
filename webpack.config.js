const fs = require('fs');
const path = require('path');
let webpack = require('webpack');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = function() {
    const entryDirectory = './src/ts/entry/';
    const entryFiles = fs.readdirSync(entryDirectory);
    let output = {
        entry: {},
        plugins: [],
        module: {
            rules: []
        },
        resolve: {
            extensions: []
        }
    };
    output.resolve.extensions.push('.js');
    output.resolve.extensions.push('.ts');
    let entries = entryFiles.map(function(entry) {
        return entry.replace(/\.tsx?/, '');
    });
    output.plugins.push(
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("development")
            }
        })
    );
    let dir = path.join(__dirname, 'dist');
    output.output = {
        path: dir,
        publicPath: "",
        filename: 'js/[name].js?v=[hash]'
    };
    //html
    entries.forEach(function(entry) {
        output.plugins.push(new HtmlWebpackPlugin({
            filename: entry + '.html',
            inject: 'body',
            template: './src/html/' + entry + '.html',
            chunks: [entry]
        }));
    });
    output.module.rules.push({
        test: /\.html$/,
        use: [ {
            loader: 'html-loader',
            options: {
                minimize: true
            }
        }],
    });
    //sass
    output.module.rules.push({
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
            fallback:'style-loader',
            use: [{
                loader: 'css-loader'
            }, {
                loader:'sass-loader'
            }]
        })
    });
    output.plugins.push(new ExtractTextPlugin("css/[name].css?v=[hash]"));
    //typescript
    entries.forEach(function(entry) {
        output.entry[entry] = entryDirectory + entry + '.ts';
    });
    output.module.rules.push({
        test: /\.tsx?$/,
        use: [{
            loader: "ts-loader",
            options: {
                exclude: './node_modules/'
            }
        }]
    });
    //images
    output.module.rules.push({
        test: /\.png$/, use: [ "url-loader?mimetype=image/png" ]
    });
    output.module.rules.push({
        test: /\.jpg$/, use: [ "url-loader?mimetype=image/jpg" ]
    });
    return output;
};