exports.Key = function(keyData) {
  var _this = this
  keyData.each(function(value, key) {
    _this[key] = value
  })
}

process.mixin(exports.Key.prototype, {
  destroy: function() {
    return "puff"
  }
})