<p align="center">
  <img src="/public/preview.png" alt='preview'>
</p>
<p align="center">
  Source code of <a href='https://sea-cinema.netlify.app/'>Cinema-app</a>. Made using next.js and tailwind-css with mongoDB.
</p>

## Cinema Website

This is a cinema website built with Next.js, Tailwind CSS, and MongoDB. The website provides various features such as user registration, login, logout, top-up balance, withdrawal, seat ordering, ticket refunding, transaction history, and more.

## Features

- User registration: Users can create new accounts on the website.
- Login and logout: Registered users can log in and log out of their accounts.
- Top-up balance: Users can add funds to their account balance.
- Withdrawal: Users can withdraw funds from their account balance.
- Seat ordering: Users can select and book seats for a particular movie.
- Ticket refunding: Users can request a refund for their movie tickets.
- Transaction history: Users can view their past transactions on the website.

## Technologies Used

- Next.js: A React framework for server-side rendering and building web applications.
- Tailwind CSS: A utility-first CSS framework for rapidly building custom designs.
- MongoDB: A NoSQL database for storing user information and transaction history.

## Getting Started

To get started with the project, follow the instructions below:

```bash
git clone https://github.com/mochavin/cinema-app.git
cd cinema-app
npm install
```

Configure the MongoDB connection:
- Open the `.env` file and replace the placeholder values with your MongoDB connection details.

Run the development server

```bash
npm run dev
```
In your browser, open `http://localhost:3000/init` to initialize the database with initial data. This step should be done only once to populate the database.

Open your browser and visit `http://localhost:3000` to see the website.

## Deploying to Netlify

Deploying to Netlify

```bash
npm install netlify-cli -g
netlify login
npm run build
netlify deploy
```

Follow the prompts from the CLI to select the deployment options.
Once the deployment is complete, Netlify will provide you with a URL for your live website.
Don't forget to initialize the database with initial data (open `http://localhost:3000/init`). This step should be done only once to populate the database.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvement, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License, Copyright (c) 2023 Avin](./LICENSE).
