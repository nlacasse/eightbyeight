var LEDBackpack = require('./led_backpack')

function Eightie(address, bus){
  address = address || 0x70
  bus = bus || 1

  this.disp = new LEDBackpack(address, bus)
}

Eightie.prototype.writeRowRaw = function(charNumber, value){
  if (charNumber > 7) return
  this.disp.setBufferRow(charNumber, value)
}

Eightie.prototype.setPixel = function(x, y, color){
  if (x >= 8) return
  if (y >= 8) return
  x = (x + 7) % 8
  var buffer = this.disp.getBuffer()
  if (color) {
    this.disp.setBufferRow(y, buffer[y] | 1 << x)
  } else {
    this.disp.setBufferRow(y, buffer[y] & ~(1 << x))
  }
}

Eightie.prototype.clearPixel = function(x, y){
  this.setPixel(x, y, 0)
}

Eightie.prototype.clear = function(){
  this.disp.clear()
}

module.exports = Eightie

