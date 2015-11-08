var associated_words = {
  'rape': ['rape', 'rapist', 'raping', 'molest', 'molestation', 'molester', 'sexual', 'assault'],
  'child abuse': ['molest', 'pedophile', 'pedophilia'],
  'self-harm': ['self-harm', 'suicide', 'anorexia', 'anorexic', 'bulimia', 'bulimic'],
  'violence': ['war', 'warfare', 'battle', 'guns', 'gun', 'gunfire', 'gunman', 'murder', 'bullet', 'bullets', 'rifle', 'fighting', 'destruction', 'explosion'],
  'kidnapping': ['kidnap', 'kidnapping', 'hostage']
};

exports.split_sanitize = function(text) {
  return text.split(" ").map(function(token) {
    return token.replace(/[.,-\/#!$%\^&\*;:{}=\-_`~()]/g,"").toLowerCase();
  });
};

exports.weight_trigger = function(theme, text_tokens) {
  var triggers = associated_words[theme];
  var total = 0;
  for (var i=0; i<text_tokens.length; i++) {
    var word = text_tokens[i];
    if (triggers.indexOf(word) >= 0) {
      total += 1
    }
  }

  return (total / text_tokens.length) * 2.5;
};