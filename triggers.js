var associated_words = {
  'rape': ['rape', 'rapist', 'raping', 'molest', 'molestation', 'molester', 'sexual', 'assault'],
  'child abuse': ['molest', 'pedophile', 'pedophilia'],
  'self-harm': ['self-harm', 'suicide', 'anorexia', 'anorexic', 'bulimia', 'bulimic'],
  'ptsd': ['war', 'warfare', 'battle', 'guns', 'gun', 'gunfire', 'gunman', 'murder', 'bullet', 'bullets', 'rifle', 'fighting', 'destruction', 'explosion']
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

exports.weight_with_api = function(theme, api_results, original_text) {
  var entities = api_results.entities;
  var total = 0;
  for (var i=0; i<entities.length; i++) {
    var entity = entities[i];
    if (entity.type == theme) {
      total += entity.original_length;
    }
  }

  return (total / original_text.length) * 2.5;
};