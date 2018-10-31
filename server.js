var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');
var urlBase = '/'
var targetUrl = "http://localhost:6541"

var listeningPort = 7531

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  disableHostCheck: true, 
  historyApiFallback: true,
  proxy: {
    [urlBase + 'api']: {
      target: targetUrl,
    },
    [urlBase + 'multimedia']: {
      target: targetUrl,
    }
  }
}).listen(listeningPort, 'localhost', function (err, result) {
  if (err) {
    return console.log(err);
  }
  console.log('Listening at http://localhost:'+listeningPort+'/');
});
