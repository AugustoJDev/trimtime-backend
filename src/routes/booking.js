const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const firebase = require('firebase/app');
require('firebase/firestore');

const secretKey = "trimtime-tokens";

const { firebaseConfig } = require('../secrets/firebaseConfig');

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}
const db = firebase.firestore();

router.get('/booking', async (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).send('Date is required');

  try {
    const bookingDoc = await db.collection('bookings').doc(date).get();
    const bookings = bookingDoc.exists ? bookingDoc.data() : {};

    const slots = [];
    const selectedDate = new Date(date);
    const dayOfWeek = selectedDate.getDay();

    if (dayOfWeek === 6) {
      for (let i = 8; i <= 12; i++) {
        slots.push({ time: `${i}:00`, booked: !!bookings[`${i}:00`] });
      }
    } else if (dayOfWeek > 0 && dayOfWeek < 6) {
      for (let i = 8; i <= 12; i++) slots.push({ time: `${i}:00`, booked: !!bookings[`${i}:00`] });
      for (let i = 14; i <= 18; i++) slots.push({ time: `${i}:00`, booked: !!bookings[`${i}:00`] });
    }

    res.json({ slots });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/booking', async (req, res) => {
  const { date, time } = req.body;
  if (!date || !time) return res.status(400).send('Date and time are required');

  try {
    const bookingDoc = db.collection('bookings').doc(date);

    await bookingDoc.set(
      {
        [time]: {
          name: 'User Name', // Replace with actual user data from authentication
          email: 'user@example.com', // Replace with actual user data from authentication
        },
      },
      { merge: true }
    );

    res.send('Booking successful');
  } catch (error) {
    console.error('Error saving booking:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Add new route to fetch month bookings
router.get('/booking/month', async (req, res) => {
    const { start, end } = req.query;
    if (!start || !end) return res.status(400).send('Start and end dates are required');

    try {
        const bookingsRef = db.collection('bookings');
        const snapshot = await bookingsRef
            .where('date', '>=', start)
            .where('date', '<=', end)
            .get();

        const bookings = {};
        snapshot.forEach(doc => {
            bookings[doc.id] = doc.data();
        });

        res.json({ bookings });
    } catch (error) {
        console.error('Error fetching month bookings:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
