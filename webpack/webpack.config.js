// webpack v4
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = [
  //minify javascript files
  {
    name: 'javascript',
    mode: 'production',

    //select javascript files to minify
    entry: {
      main: './src/js/main.js',
      openstreetmap: './src/js/openstreetmap.js',
      util: './src/js/util.js',
      webcomponents: './src/js/webcomponents.js'
    },

    //select output path for the minified files
    output: {
      path: path.resolve(__dirname, '../assets/js/'),
      filename: '[name].min.js'
    },

    module: {
      //minfy .js files using babel-loader
      rules: [
        {
          test: /\.js$/,
          include: /src\/js/,
          use: {
            loader: "babel-loader"
          }
        },
      ]
    }
  },

  //compile and minify scss/sass files
  {
    name: 'scss',
    mode: 'production',

    //select sass files to compile and minify
    entry: { 
      scss: ['./src/scss/ie9.scss', './src/scss/main.scss']},

    //select output path for the generated js file
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].min.js'
    },

    module: {
      // compile sass, optimise css, minify css and output it to assets/css
      rules: [
        {
        test: /\.s[c|a]ss$/,
        include: /src\/s[c|a]ss/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].min.css',
              outputPath: '../../assets/css/',
            }
          },
          {
            loader: 'extract-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [
                require('autoprefixer')({}),
                require('cssnano')({ preset: 'default' })
              ],
              minimize: true
            }
          },
          {
            loader: 'sass-loader'
          }
        ]
      }]
    },
    plugins: [
      //clean output folder
      new CleanWebpackPlugin()
    ]
  }
];
