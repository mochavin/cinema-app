// import mongodb
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method != 'POST') return res.status(405).end(); // Method Not Allowed
  // Process a POST request
  const data = req.body;
  data.balance = parseInt(data.balance);
  // Do something with _id
  // get users by _id
  const client = await clientPromise;
  const db = client.db('cinema-fix');
  const user = await db
    .collection('users')
    .find({ _id: ObjectId(data._id) })
    .toArray();

  // check if user exists
  if (user.length == 0)
    return res.status(400).json({ message: 'User not found' });

  // update balance
  const result = await db.collection('users').updateOne(
    { _id: ObjectId(data._id) },
    {
      $set: {
        balance: user[0].balance + data.balance,
      },
    }
  );

  // insert to history
  const history = {
    userId: data._id,
    balance: data.balance,
    type: 'topup',
    date: new Date().getTime(),
  };
  await db.collection('histories').insertOne(history);

  // return user
  res
    .status(200)
    .json({
      message: 'Top up success',
      balance: user[0].balance + data.balance,
    });
}
