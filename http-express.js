var express = require('express');
var server = express();
var fs = require('fs');
var path = require('path');
var pkg = {
  httpExpress: require('./package.json'),
  express: require('./node_modules/express/package.json'),
  blessed: require('./node_modules/blessed/package.json')
};

var moment = require('moment');
var blessed = require('blessed');
var widgets = require('./widgets');
var screen = blessed.screen();

function stylize() {
  var text = arguments['0'];
  delete arguments['0'];

  var output = text;

  for (var key in arguments) {
    if (arguments.hasOwnProperty(key)) {
      output = '{' + arguments[key] + '}' + output + '{/' + arguments[key] + '}'
    }
  }

  return output;
};

var style = {
  fg: '#00FFFF'
};

var serverInfoWidget = widgets.serverInfo(blessed, style);
screen.append(serverInfoWidget);

var logWidget = widgets.log(blessed, style);
screen.append(logWidget);

console.log = function(obj) {
    var timestamp = stylize(moment().format('h:mm:ss A'), 'white-fg');
    var left = stylize('[', 'magenta-fg');
    var right = stylize(']', 'magenta-fg');

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
    var filePath = path.join(process.cwd(), req.url);

    if (!fs.existsSync(filePath) || req.url === '/') {
      status = stylize(404, 'red-fg');
    }

    if (req.url === '/' && fs.existsSync(filePath + 'index.html') ) {
      req.url = '/index.html'
      status = stylize(200, 'green-fg');
    } else if (fs.existsSync(filePath) && fs.lstatSync(filePath).isDirectory()) {
      if (/\/$/.test(req.url)) {
        status = stylize(404, 'red-fg');
      } else {
        dolog = false;
      }
    }

    if (dolog) {
      console.log(req.method + ' ' + status + ' - ' + stylize(req.url, 'white-fg'));
      screen.render();
    }

    next();
  });

  server.use(express.static(process.cwd()));
});

server.listen(config.port);

screen.render();

//Populate server info
serverInfoWidget.insertLine(0, stylize('Local IP: ', 'cyan-fg'));
serverInfoWidget.insertLine(1, stylize('Port: ', 'cyan-fg'));
serverInfoWidget.insertLine(2, stylize('Versions ', 'cyan-fg'));
serverInfoWidget.insertLine(3, stylize(' Express: ', 'cyan-fg'));
serverInfoWidget.insertLine(4, stylize(' blessed: ', 'cyan-fg'));

require('dns').lookup(require('os').hostname(), function (error, address) {
  serverInfoWidget.setLine(0, stylize('Local IP: ', 'cyan-fg') + stylize(address, 'white-fg'));
  serverInfoWidget.setLine(1, stylize('Port: ', 'cyan-fg') + stylize(config.port, 'white-fg'));
  serverInfoWidget.setLine(3, stylize(' Express: ', 'cyan-fg') + stylize(pkg.express.version, 'white-fg'));
  serverInfoWidget.setLine(4, stylize(' blessed: ', 'cyan-fg') + stylize(pkg.blessed.version, 'white-fg'));
  screen.render();
})