const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeJsPlugin = require('optimize-js-plugin');
const plugins = [new HtmlWebpackPlugin({
    template: 'public/index.html',
    filename: 'index.html',
    inject: 'body'
})];



//webpack.config.js
module.exports = (env) => { // Ta funkcja jako parametr będzie zawierać środowisko, które przekażemy w CLI !!!!!
    if (env === 'production') {
        plugins.push(
            new OptimizeJsPlugin({
                sourceMap: false
            })
        )
    }
    return {
        entry: (env !== 'production' ? [
                'react-hot-loader/patch',
                'webpack-dev-server/client?http://localhost:8080',
                'webpack/hot/only-dev-server',
            ] : []).concat(['./client/index.js']),
        output: {
          filename: './bundle.js',
          path: path.resolve(__dirname, 'public'),
        },
        devServer: {
            proxy: {
                '/socket.io': {
                target: 'http://localhost:3000',
                ws: true
                }
            }
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    loader: "babel-loader",
                    options: {
                        plugins: env !== 'production' ? ['react-hot-loader/babel'] : []
                        //jeśli nie jesteśmy na produkcji to doajemey, a jak nie jesteśmy to dodajemy pustą tablicę
                    }
                },
                {
                    test: /\.css$/,
                    use: [ //Parametr use to odpowiednik pojedynczego loader. Przyjmuje on listę loaderów, przez które musi przejść plik .css, aby stać się modułem.
                        {loader: 'style-loader'},
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true
                            }
                        }
                    ]
                },
                {
                    test: /\.(html)$/,
                    use: {
                    loader: 'html-loader',
                    options: {
                    attrs: [':data-src']
                        }
                    }
                }
            ]
        },
        plugins
    }
};