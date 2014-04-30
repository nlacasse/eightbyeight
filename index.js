var LEDBackpack = require('./led_backpack')

function EightByEight(address, bus){
  address = address || 0x70
  bus = bus || 1

  this.disp = new LEDBackpack(address, bus)
}

EightByEight.prototype.setPixel = function(x, y, color){
  color = color || 1
  if (x < 0 || x > 7) return
  if (y < 0 || y > 7) return
  x = (x + 7) % 8 // x rows are off-by-one.  Bug?
  var row = this.disp.getBufferRow(y)
  if (color) {
    this.disp.setBufferRow(y, row | 1 << x)
  } else {
    this.disp.setBufferRow(y, row & ~(1 << x))
  }
}

EightByEight.prototype.clearPixel = function(x, y){
  this.setPixel(x, y, 0)
}

EightByEight.prototype.startTransaction = function(){
  this.disp.startTransaction()
}

EightByEight.prototype.commitTransaction = function(){
  this.disp.commitTransaction()
}

EightByEight.prototype.clear = function(){
  this.disp.clear()
}

EightByEight.prototype.allOn = function(){
  this.disp.allOn()
}

EightByEight.prototype.allOff = function(){
  this.disp.allOff()
}

module.exports = EightByEight

