/* eslint-disable */
const path = require('path');
const { override, useBabelRc, useEslintRc } = require('customize-cra');
const PrerenderSPAPlugin = require('prerender-spa-plugin');

const addSitePlugins = () => config => {
  if (process.env.NODE_ENV !== 'production') {
    return config;
  }

  const routes = [{ path: '/' }, { path: '/404' }];

  config.plugins.push(
    new PrerenderSPAPlugin({
      // Required - The path to the webpack-outputted app to prerender.
      staticDir: path.join(__dirname, 'build'),
      // Required - Routes to render.
      routes: routes.map(route => route.path),
      // Make prerendering more stable
      renderer: new PrerenderSPAPlugin.PuppeteerRenderer({
        maxConcurrentRoutes: 1,
        renderAfterTime: 1000
      })
    })
  );

  return config;
};

module.exports = override(useBabelRc(), useEslintRc(), addSitePlugins());
