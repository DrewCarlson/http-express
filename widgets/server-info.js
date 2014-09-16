module.exports = function(blessed, screen, style) {
  return blessed.box({ //TODO: make scrollable box
    parent: screen,
    label: 'Server',
    top: '75%',
    left: '75%',
    width: '25%',
    tags: true,
    border: {
      type: 'line',
    },
    style: style
  });
};