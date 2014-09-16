module.exports = function(blessed, style) {
  return blessed.box({ //TODO: make scrollable box
    label: 'Server',
    top: '75%',
    left: '75%',
    width: '25%',
    mouse: true,
    keyboard: true,
    tags: true,
    border: {
      type: 'line',
    },
    style: style
  });
};