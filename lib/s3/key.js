require("kiwi").require("ext", "0.5.0")

exports.Key = function(s3Interface, keyData) {
  var _this = this
  
  this.s3Interface = s3Interface
  keyData.each(function(value, key) {
    _this[key] = value
  })
}

var methods = {
  destroy: function() {
    
  }
}

methods.each(function(method, methodName) {
  exports.Key.prototype[methodName] = method
})