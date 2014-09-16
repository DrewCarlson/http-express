module.exports.stylize = function() {
  var text = arguments['0'];
  delete arguments['0'];

  var output = text;

  for (var key in arguments) {
    if (arguments.hasOwnProperty(key)) {
      output = '{' + arguments[key] + '}' + output + '{/' + arguments[key] + '}'
    }
  }

  return output;
}