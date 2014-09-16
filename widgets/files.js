module.exports = function(blessed, style) {
  var fileManager =  blessed.filemanager({
    label: 'Files',
    left: '75%',
    height: '75%',
    width: '25%',
    mouse: true,
    keyboard: true,
    tags: true,
    border: {
      type: 'line',
    },
    style: style
  });

  fileManager.on('file', function() {
    console.log(arguments);
  });

  fileManager.refresh(config.path, function() {});

  return fileManager;
};