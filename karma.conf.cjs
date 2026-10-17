// Configuracion Karma
module.exports = function (config) {
  config.set({
    frameworks: ['jasmine', 'webpack'],
    files: [
      { pattern: 'src/tests/**/*.spec.js?(x)', watched: false },
      { pattern: 'public/img/*', included: false, served: true, watched: false },
    ],
    proxies: { '/img/': '/base/public/img/' },
    preprocessors: {
      'src/tests/**/*.spec.js?(x)': ['webpack'],
    },
    webpack: {
      mode: 'development',
      devtool: 'inline-source-map',
      resolve: { extensions: ['.js', '.jsx'] },
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            resolve: { fullySpecified: false },
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  '@babel/preset-env',
                  ['@babel/preset-react', { runtime: 'automatic' }],
                ],
                plugins: [['istanbul', { exclude: ['src/tests/**'] }]],
              },
            },
          },
          { test: /\.css$/, use: ['style-loader', 'css-loader'] },
        ],
      },
    },
    reporters: ['progress', 'kjhtml', 'coverage'],
    coverageReporter: {
      dir: 'coverage/',
      reporters: [{ type: 'html', subdir: 'html' }, { type: 'text-summary' }],
    },
    client: {
      jasmine: { random: false },
      clearContext: false,
    },
    browsers: ['ChromeHeadless'],
    singleRun: false,
  });
};