exports.Bucket = function(bucketName, meta) {
  this.bucketName = bucketName
  this.meta = meta
}

process.mixin(exports.Bucket.prototype, {
  clear: function() {

  },
  create: function(key, data) {

  },
  remove: function(key) {

  },
  removeFolder: function(folderKey) {

  },
  fullName: function() {

  },
  get: function() {

  },
  key: function(keyName) {

  },
  keys: function() {

  },
  keysAndMeta: function() {

  },
  publicUrl: function() {

  },
  put: function() {

  },
  toString: function() {
    return "foo"
  }
})