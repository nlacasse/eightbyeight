var LEDBackpack = require('./led_backpack')

function EightByEight(address, bus){
  address = address || 0x70
  bus = bus || 1

  this.disp = new LEDBackpack(address, bus)
}

EightByEight.prototype.setPixel = function(x, y, color){
  if (x < 0 || x > 7) return
  if (y < 0 || y > 7) return
  var row = this.disp.getBufferRow(y)
  if (color) {
    this.disp.setBufferRow(y, buffer[y] | 1 << x)
  } else {
    this.disp.setBufferRow(y, buffer[y] & ~(1 << x))
  }
}

EightByEight.prototype.clearPixel = function(x, y){
  this.setPixel(x, y, 0)
}

EightByEight.prototype.clear = function(){
  this.disp.clear()
}

module.exports = EightByEight

