const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
  customerName: String,
  seatsBooked: Number,
  bus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus'
  },
  bookedAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Booking', bookingSchema)
