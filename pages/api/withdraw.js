import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method != 'POST') return res.status(405).end(); // Method Not Allowed

  const { _id, balance } = req.body;
  const client = await clientPromise;
  const db = client.db('cinema-fix');

  // get balance user
  const user = await db
    .collection('users')
    .find({ _id: ObjectId(_id) })
    .toArray();

  // validate balance enough
  if (user[0].balance < balance) {
    return res.status(400).json({ message: 'Balance not enough' });
  }

  // update balance user
  const result = await db
    .collection('users')
    .updateOne({ _id: ObjectId(_id) }, { $inc: { balance: -balance } });

  // insert history
  const history = {
    userId: _id,
    balance: parseInt(balance),
    type: 'withdraw',
    date: new Date().getTime(),
  }
  await db.collection('histories').insertOne(history);

  return res.status(200).json({ message: 'Withdraw success', balance: user[0].balance - balance });

}