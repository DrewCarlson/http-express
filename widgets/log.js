module.exports = function(blessed, screen, style) {
  return blessed.box({
    parent: screen,
    label: 'Log',
    left: 'left',
    width: '75%',
    tags: true,
    border: {
      type: 'line',
    },
    style: style
  });
};