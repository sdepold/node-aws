var kiwi = require("kiwi")

sys         = require("sys")
aws         = require(__dirname + "/../lib/aws")
credentials = require(__dirname + "/credentials")

kiwi.require("NoSpec")

new NoSpec()
  .load(__dirname + "/s3.js")
  .run()