const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Bus = require('./models/Bus');
const Booking = require('./models/Booking');
const User = require('./models/User');
const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
mongoose.connect('mongodb://127.0.0.1:27017/busReservationDB')
  .then(() => console.log('MongoDB connected'));
async function seedBuses() {
  const count = await Bus.countDocuments();
  if (count === 0) {
    await Bus.insertMany([
      { route: 'Pondicherry - Chennai', departureTime: '09:00 AM', price: 300, totalSeats: 40, availableSeats: 40, busNumber: 1 },
      { route: 'Pondicherry - Bangalore', departureTime: '10:30 AM', price: 600, totalSeats: 50, availableSeats: 48, busNumber: 2 },
      { route: 'Pondicherry - Coimbatore', departureTime: '02:00 PM', price: 450, totalSeats: 45, availableSeats: 45, busNumber: 3 },
      { route: 'Pondicherry - Salem', departureTime: '05:30 PM', price: 250, totalSeats: 35, availableSeats: 35, busNumber: 4 }
    ]);
  }
}
seedBuses();
app.post('/api/signup', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Invalid' });
  const exists = await User.findOne({ username });
  if (exists) return res.status(400).json({ message: 'Exists' });
  await User.create({ username, password });
  res.json({ message: 'Signup OK' });
});
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || user.password !== password) return res.status(400).json({ message: 'Invalid' });
  res.json({ username });
});
app.get('/api/buses', async (req, res) => {
  res.json(await Bus.find());
});
app.post('/api/bookings', async (req, res) => {
  const { busId, customerName, seats } = req.body;
  const bus = await Bus.findById(busId);
  if (!bus || bus.availableSeats < seats) return res.status(400).json({ message: 'Error' });
  bus.availableSeats -= seats;
  await bus.save();
  const booking = await Booking.create({ bus: bus._id, customerName, seatsBooked: seats });
  res.json(booking);
});
app.get('/api/my-bookings/:username', async (req, res) => {
  const bookings = await Booking.find({ customerName: req.params.username }).populate('bus');
  res.json(bookings);
});
app.listen(5000, () => console.log('Server running'));
