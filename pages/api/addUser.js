import clientPromise from '@/lib/mongodb';

export default async function handler(req, res) {
  if (req.method != 'POST') return res.status(405).end(); // Method Not Allowed
  // Process a POST request
  const data = req.body;
  // Do something with username, password and birthDate

  const client = await clientPromise;
  const db = client.db('cinema-fix');


  // check if username already exists
  const user = await db
    .collection('users')
    .find({ username: data.username })
    .toArray();
  
  if (user.length > 0)
    return res.status(400).json({ message: 'Username already exists' });

  if (data.username.length < 5 || data.username.length > 20)
    return res
      .status(400)
      .json({ message: 'Username must be between 6 and 20 characters' });

  if (data.password.length < 5 || data.password.length > 20)
    return res
      .status(400)
      .json({ message: 'Password must be between 6 and 20 characters' });

  if (data.password != data.confirmPassword)
    return res
      .status(400)
      .json({ message: 'Password and Confirm Password must be the same' });

  if (data.birthDate > new Date().getTime())
    return res.status(400).json({ message: 'Birth Date must be in the past' });

  data.balance = 0;

  // dont save confirm password
  delete data.confirmPassword;


  const result = await db.collection('users').insertOne(data);
  data._id = result.insertedId.toString();
  res.status(200).json(data);
}
