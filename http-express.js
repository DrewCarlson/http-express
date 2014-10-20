var express = require('express'),
  server = express(),
  fs = require('fs'),
  path = require('path'),
  pkg = {
    httpExpress: require('./package.json'),
    express: require('./node_modules/express/package.json'),
    blessed: require('./node_modules/blessed/package.json')
  },
  utils = require('./utils'),
  http = require('http');

var moment = require('moment'),
  blessed = require('blessed'),
  widgets = require('./widgets'),
  screen = blessed.screen();

var style = {
  fg: '#00FFFF'
};

var serverInfoWidget = widgets.serverInfo(blessed, screen, style);
screen.append(serverInfoWidget);

var logWidget = widgets.log(blessed, screen, style);
screen.append(logWidget);

console.oLog = console.log;
console.log = function(obj) {
  var timestamp = utils.stylize(moment().format('h:mm:ss A'), 'white-fg');
  var left = utils.stylize('[', 'magenta-fg');
  var right = utils.stylize(']', 'magenta-fg');

  logWidget.insertTop(left + timestamp + right + ' ' + obj);
};

var filesWidget = widgets.files(blessed, screen, style);
screen.append(filesWidget);

screen.key(['escape', 'C-c'], function(ch, key) {
  return process.exit(0);
});

//Server setup
server.use(function(req, res, next) {
  var logMessage = true;

  var status = utils.stylize(200, 'green-fg'),
    errStatus = utils.stylize(404, 'red-fg');

  var filePath = path.join(config.path, req.url);

  if (req.url !== '/' && !fs.existsSync(filePath)) {
    status = errStatus;
  }

  if (logMessage) {
    console.log(req.method + ' ' + status + ' - ' + utils.stylize(req.url, 'white-fg'));
    screen.render();
  }

  next();
});

server.use(express.static(config.path));
server.use(express.directory(config.path));

server.listen(config.port);

//Populate server info
serverInfoWidget.insertLine(0, utils.stylize('Local IP: ', 'cyan-fg'));
serverInfoWidget.insertLine(1, utils.stylize('Port: ', 'cyan-fg') + utils.stylize(config.port, 'white-fg'));
serverInfoWidget.insertLine(2, utils.stylize('Versions ', 'cyan-fg'));
serverInfoWidget.insertLine(3, utils.stylize(' Express: ', 'cyan-fg') + utils.stylize(pkg.express.version, 'white-fg'));
serverInfoWidget.insertLine(4, utils.stylize(' blessed: ', 'cyan-fg') + utils.stylize(pkg.blessed.version, 'white-fg'));

screen.render();

require('dns').lookup(require('os').hostname(), function (error, address) {
  serverInfoWidget.setLine(0, utils.stylize('Local IP: ', 'cyan-fg') + utils.stylize(address, 'white-fg'));
  screen.render();
});

var newVersion = '';

http.get('http://registry.npmjs.org/' + pkg.httpExpress.name, function(res){
    var data = '';

    res.on('data', function (chunk){
        data += chunk;
    });

    res.on('end', function(err) {
      if (!err) {
        var registryInfo = JSON.parse(data);

        if (registryInfo["dist-tags"].latest !== pkg.httpExpress.version) {
          newVersion = registryInfo["dist-tags"].latest;
        } 
      }
    });
});

process.on('exit', function(code) {
  if (newVersion) {
    console.oLog("A new version of http-express is available, run `npm update http-express` to get %s", newVersion);
  }
});