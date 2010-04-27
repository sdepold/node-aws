exports.Key = function(s3Interface, keyData) {
  var _this = this
  
  this.s3Interface = s3Interface
  keyData.each(function(value, key) {
    _this[key] = value
  })
}

process.mixin(exports.Key.prototype, {
  destroy: function() {
    
  }
})