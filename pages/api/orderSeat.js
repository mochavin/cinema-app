// order seat api

import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method != 'POST') return res.status(405).end(); // Method Not Allowed
  // Process a POST request
  const data = req.body;

  // get film from mongodb
  const client = await clientPromise;
  const _id = { _id: ObjectId(data.filmId) };
  const db = client.db('cinema-fix');
  const film = await db
    .collection('films')
    .find({ _id: ObjectId(data.filmId) })
    .toArray();

  if (film.length == 0)
    return res.status(404).json({ message: 'Film not found' });

  // get user from mongodb
  const user = await db
    .collection('users')
    .find({ _id: ObjectId(data.userId) })
    .toArray();

  if (user.length == 0)
    return res.status(404).json({ message: 'User not found' });

  // check if seat is available
  for(const seat of data.seats){
    if(film[0].seats[seat] == 1) return res.status(400).json({message: "Seat not available"});
  }

  // check balance
  if (user[0].balance < data.seats.length * film[0].ticket_price)
    return res.status(400).json({ message: 'Balance not enough' });

  // update user
  const result2 = await db.collection('users').updateOne(
    { _id: ObjectId(data.userId) },
    {
      $set: {
        balance: user[0].balance - data.seats.length * film[0].ticket_price,
      },
    }
  );
  // update film
  film.seats = film[0].seats.map((seat, index) => {
    if (data.seats.includes(index)) return 1;
    return seat;
  });

  const result1 = await db.collection('films').updateOne(
    { _id: ObjectId(data.filmId) },
    {
      $set: {
        seats: film.seats,
      },
    }
  );

  // add to history
  data.seats.forEach(async (seat) => {
    const result3 = await db.collection('history').insertOne({
      user_id: ObjectId(data.userId),
      film_id: ObjectId(data.filmId),
      seat: seat,
      date: new Date(),
    });
  });

  // insert to histories
  const history = {
    userId: data.userId,
    filmId: data.filmId,
    seat: data.seats,
    date: new Date().getTime(),
    price: data.seats.length * film[0].ticket_price,
    type: 'order'
  };
  await db.collection('histories').insertOne(history);



  // return user
  res.status(200).json({
    message: 'Order success',
    balance: user[0].balance - data.seats.length * film[0].ticket_price,
  });
}
