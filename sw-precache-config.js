module.exports = {
  // Files to be cached
  // Excluding amp files
  staticFileGlobs: [
    '_site/css/**.css',
    '_site/*/index.html',
    '_site/assets/**.*',
    '_site/scripts/**.js',
    '_site/index.html',
    '_site/!{amp,amp/**/index.html}'
  ],
  stripPrefix: '_site/',
  verbose: true,
  ignoreUrlParametersMatching: [/./],
  // CDN Files to be cached
  runtimeCaching: [{
    urlPattern: /^https:\/\/ajax\.googleapis\.com\/ajax\/libs/,
    handler: 'networkFirst'
  },
  {
    urlPattern: /^https:\/\/fonts\.googleapis\.com\/css/,
    handler: 'networkFirst'
  }]
};