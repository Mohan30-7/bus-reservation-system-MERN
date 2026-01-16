const mongoose = require('mongoose')

const busSchema = new mongoose.Schema({
  route: String,
  departureTime: String,
  price: Number,
  totalSeats: Number,
  availableSeats: Number,
  busNumber: Number
})

module.exports = mongoose.model('Bus', busSchema)
