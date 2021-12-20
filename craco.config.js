const CracoLessPlugin = require('craco-less');

module.exports = {
  eslint: {
    enable: false
  },
  style: {
    css: {
      loaderOptions: (cssLoaderOptions, { env, paths }) => {
        return cssLoaderOptions;
      }
    }
  },
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      return webpackConfig;
    }
  },
  devServer: (devServerConfig, { env, paths, proxy, allowedHost }) => {
    devServerConfig.before = require('./mock/mock-server.js');
    return devServerConfig;
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@primary-color': 'rgb(0, 82, 204)',
              '@border-radius-base': '4px'
            },
            javascriptEnabled: true,
          }
        }
      }
    }
  ]
}