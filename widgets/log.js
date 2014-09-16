module.exports = function(blessed, style) {
  return blessed.box({
    label: 'Log',
    left: 'left',
    width: '75%',
    mouse: true,
    keyboard: true,
    tags: true,
    border: {
      type: 'line',
    },
    style: style
  });
};