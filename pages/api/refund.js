import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const data = req.body;

  const client = await clientPromise;
  const db = client.db("cinema-fix");
  const history = await db
    .collection("history")
    .find({ _id: ObjectId(data._id) })
    .toArray();

  console.log(history);

  if (history.length === 0) {
    return res.status(400).json({ message: "History not found" });
  }

  const film = await db
    .collection("films")
    .find({ _id: history[0].film_id })
    .toArray();

  if (film.length === 0) {
    return res.status(400).json({ message: "Film not found" });
  }

  const user = await db
    .collection("users")
    .find({ _id: ObjectId(history[0].user_id) })
    .toArray();

  if (user.length === 0) {
    return res.status(400).json({ message: "User not found" });
  }

  user[0].balance += film[0].ticket_price;

  await db
    .collection("users")
    .updateOne(
      { _id: ObjectId(history[0].user_id) },
      { $set: { balance: user[0].balance } }
    );

  await db
    .collection("history")
    .deleteOne({ _id: ObjectId(history[0]._id) });
  
  film[0].seats[history[0].seat] = 0;

  console.log(film[0].seats);

  const uppp = await db
    .collection("films")
    .updateOne(
      { _id: history[0].film_id },
      { $set: { seats: film[0].seats } }
    );

  console.log(uppp);

  // insert to histories
  console.log(history[0]);
  const result = await db.collection("histories").insertOne({
    userId: history[0].user_id.toString(),
    filmId: history[0].film_id,
    seat: history[0].seat,
    type: "refund",
    date: new Date().getTime(),
    price: film[0].ticket_price,
  });

  console.log(result);

  return res.status(200).json(history);

}