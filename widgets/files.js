module.exports = function(blessed, screen, style) {
  var fileManager =  blessed.filemanager({
    parent: screen,
    label: 'Files',
    left: '75%',
    height: '75%',
    width: '25%',
    mouse: true,
    keys: true,
    tags: true,
    border: {
      type: 'line',
    },
    scrollbar: {
      bg: 'white',
      ch: ' '
    },
    style: style
  });

  fileManager.on('file', function() {});

  fileManager.refresh(config.path, function() {});

  return fileManager;
};