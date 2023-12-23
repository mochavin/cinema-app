import clientPromise from '@/lib/mongodb';

export default async function handler(req, res) {
  if (req.method != 'POST') return res.status(405).end(); // Method Not Allowed
  // Process a POST request
  const data = req.body;
  // Do something with username, password
  // get users by username
  const client = await clientPromise;
  const db = client.db('cinema-fix');
  const user = await db
    .collection('users')
    .find({ username: data.username })
    .toArray();
  // check if user exists
  if (user.length == 0){
    // insert to collection user
    const result = await db.collection('users').insertOne(data);
    data._id = result.insertedId.toString();
    res.status(200).json(data);
  }else{
    // get _id from user
    const result = await db
      .collection('users')
      .find({ username: data.username })
      .toArray();
    data._id = result[0]._id;
    res.status(200).json(data);
  }
}