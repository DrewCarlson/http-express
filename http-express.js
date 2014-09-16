var express = require('express'),
  server = express(),
  fs = require('fs'),
  path = require('path'),
  pkg = {
    httpExpress: require('./package.json'),
    express: require('./node_modules/express/package.json'),
    blessed: require('./node_modules/blessed/package.json')
  },
  utils = require('./utils');

var moment = require('moment'),
  blessed = require('blessed'),
  widgets = require('./widgets'),
  screen = blessed.screen();

var style = {
  fg: '#00FFFF'
};

var serverInfoWidget = widgets.serverInfo(blessed, style);
screen.append(serverInfoWidget);

var logWidget = widgets.log(blessed, style);
screen.append(logWidget);

console.log = function(obj) {
  var timestamp = utils.stylize(moment().format('h:mm:ss A'), 'white-fg');
  var left = utils.stylize('[', 'magenta-fg');
  var right = utils.stylize(']', 'magenta-fg');

  logWidget.insertTop(left + timestamp + right + ' ' + obj);
};

var filesWidget = widgets.files(blessed, style);
screen.append(filesWidget);

screen.key(['escape', 'C-c'], function(ch, key) {
  return process.exit(0);
});

//Server setup
server.configure(function() {
  server.use(function(req, res, next) {
    var dolog = true;

    var status = stylize(200, 'green-fg');
    var filePath = path.join(config.path, req.url);

    if (!fs.existsSync(filePath) || req.url === '/') {
      status = utils.stylize(404, 'red-fg');
    }

    if (req.url === '/' && fs.existsSync(filePath + 'index.html') ) {
      req.url = '/index.html'
      status = utils.stylize(200, 'green-fg');
    } else if (fs.existsSync(filePath) && fs.lstatSync(filePath).isDirectory()) {
      if (/\/$/.test(req.url)) {
        status = utils.stylize(404, 'red-fg');
      } else {
        dolog = false;
      }
    }

    if (dolog) {
      console.log(req.method + ' ' + status + ' - ' + utils.stylize(req.url, 'white-fg'));
      screen.render();
    }

    next();
  });

  server.use(express.static(config.path));
});

server.listen(config.port);

//Populate server info
serverInfoWidget.insertLine(0, utils.stylize('Local IP: ', 'cyan-fg'));
serverInfoWidget.setLine(1, utils.stylize('Port: ', 'cyan-fg') + utils.stylize(config.port, 'white-fg'));
serverInfoWidget.insertLine(2, utils.stylize('Versions ', 'cyan-fg'));
serverInfoWidget.setLine(3, utils.stylize(' Express: ', 'cyan-fg') + utils.stylize(pkg.express.version, 'white-fg'));
serverInfoWidget.setLine(4, utils.stylize(' blessed: ', 'cyan-fg') + utils.stylize(pkg.blessed.version, 'white-fg'));

screen.render();

require('dns').lookup(require('os').hostname(), function (error, address) {
  serverInfoWidget.setLine(0, utils.stylize('Local IP: ', 'cyan-fg') + utils.stylize(address, 'white-fg'));
  screen.render();
})