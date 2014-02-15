var i2c = require('i2c');
var _ = require('underscore')

// Registers
var __HT16K33_REGISTER_DISPLAY_SETUP = 0x80
var __HT16K33_REGISTER_SYSTEM_SETUP = 0x20
var __HT16K33_REGISTER_DIMMING = 0xE0

// Blink rate
var __HT16K33_BLINKRATE_OFF = 0x00
var __HT16K33_BLINKRATE_2HZ = 0x01
var __HT16K33_BLINKRATE_1HZ = 0x02
var __HT16K33_BLINKRATE_HALFHZ = 0x03

function LEDBackpack(address, bus){
  bus = bus || 1
  this.wire = new i2c(address, {device: '/dev/i2c-' + bus})

  // Display buffer (8x16-bits)
  this.buffer = [0, 0, 0, 0, 0, 0, 0, 0]

  // transaction level
  this.transactionLevel = 0;

  // Turn the oscillator on
  this.wire.writeBytes(__HT16K33_REGISTER_SYSTEM_SETUP | 0x01, [0x00])

  // Turn blink off
  this.setBlinkRate(__HT16K33_BLINKRATE_OFF)

  // Set maximum brightness
  this.setBrightness(15)

  // Clear the screen
  this.clear()
}

LEDBackpack.prototype.setBrightness = function(brightness){
  if (brightness > 15) brightness = 15
  this.wire.writeBytes(__HT16K33_REGISTER_DIMMING | brightness, [0x00])
}

LEDBackpack.prototype.setBlinkRate = function(blinkRate){
  if (blinkRate > __HT16K33_BLINKRATE_HALFHZ) blinkRate = __HT16K33_BLINKRATE_OFF
  this.wire.writeBytes(__HT16K33_REGISTER_DISPLAY_SETUP | 0x01 | (blinkRate << 1), [0x00])
}

LEDBackpack.prototype.setBufferRow = function(row, value){
  if (row < 0 || row > 7) return
  this.buffer[row] = value // value # & 0xFFFF
  if (this.transactionLevel === 0) {
    this.writeDisplay()
  }
}

LEDBackpack.prototype.getBuffer = function(){
  return _.clone(this.buffer)
}

LEDBackpack.prototype.getBufferRow = function(row){
  if (row < 0 || row > 7) return
  return this.buffer[row]
}

LEDBackpack.prototype.writeDisplay = function(){
  var bytes = []
  _.each(this.buffer, function(item){
    bytes.push(item & 0xFF)
    bytes.push((item >> 8) & 0xFF)
  })
  this.wire.writeBytes(0x00, bytes)
}

LEDBackpack.prototype.clear = function(){
  this.buffer = [ 0, 0, 0, 0, 0, 0, 0, 0 ]
  if (this.transactionLevel === 0) {
    this.writeDisplay()
  }
}

LEDBackpack.prototype.startTransaction = function(){
  this.transactionLevel++;
}

LEDBackpack.prototype.commitTransaction = function(){
  this.transactionLevel--;
  if (transactionLevel === 0) {
    this.writeDisplay()
  }
}

module.exports = LEDBackpack
