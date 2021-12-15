const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      $ENV: {
        PRODUCTION: JSON.stringify(process.env.PRODUCTION) === 'false'? false: true,
        FYLE_URL: JSON.stringify(process.env.FYLE_URL),
        FYLE_APP_URL: JSON.stringify(process.env.FYLE_APP_URL),
        FYLE_CLIENT_ID: JSON.stringify(process.env.FYLE_CLIENT_ID),
        CALLBACK_URI: JSON.stringify(process.env.CALLBACK_URI),
        API_URL: JSON.stringify(process.env.API_URL),
        APP_URL: JSON.stringify(process.env.APP_URL),
        SENTRY_DSN: JSON.stringify(process.env.SENTRY_DSN),
        RELEASE: JSON.stringify(process.env.RELEASE)
      }
    })
  ]
};