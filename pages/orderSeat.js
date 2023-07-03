'use client';
import '@/styles/globals.css';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Button from '@/components/Button';
import Alert from '@/components/Alert';
import Cookies from 'universal-cookie';
import Link from 'next/link';
import Back from '@/components/Back';
import Head from 'next/head';

export default function SeatBooking() {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [avalSeats, setAvalSeats] = useState([]);
  const [balance, setBalance] = useState(0);
  const [film, setFilm] = useState({
    title: '',
  });
  const [alert, setAlert] = useState('');
  const [idFilm, setIdFilm] = useState('');
  const [userAge, setUserAge] = useState(90);
  const [navbar, setNavbar] = useState(<Navbar balance='-' setOrderBalance={setBalance}/>);

  const getFilm = async () => {
    let res = await fetch('/api/getfilm');
    let json = await res.json();
    return json;
  };

  useEffect(() => {
    const cookies = new Cookies();
    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams(url.search);
    const idFilm = searchParams.get('id');
    setIdFilm(idFilm);

    fetch('/api/getFilm/' + idFilm)
      .then((res) => res.json())
      .then((data) => {
        setAvalSeats(data.seats);
        setFilm(data);
      });

    fetch('/api/getUser/' + cookies.get('_id'))
      .then((res) => res.json())
      .then((data) => {
        setBalance(data.balance);
        setUserAge((new Date().getTime() - data.birthDate) / 31536000000);
        setNavbar(<Navbar balance={data.balance} setOrderBalance={setBalance}/>);
      });
  }, []);

  const handleSeatClick = (index) => {
    if (
      (selectedSeats.length + 1) * film.ticket_price > balance &&
      !selectedSeats.includes(index)
    ) {
      setAlert(<Alert type='failed'>Insufficient balance</Alert>);
      setTimeout(() => setAlert(''), 3000);
      return;
    }

    if (selectedSeats.length > 5 && !selectedSeats.includes(index)) {
      setAlert(<Alert type='failed'>Max 6 seats</Alert>);
      setTimeout(() => setAlert(''), 3000);
      return;
    }
    if (selectedSeats.includes(index)) {
      setSelectedSeats(selectedSeats.filter((value) => value !== index));
    } else {
      setSelectedSeats([...selectedSeats, index]);
    }
  };

  const handleOrderClick = () => {
    const cookies = new Cookies();

    if (selectedSeats.length === 0) {
      setAlert(<Alert type='failed'>No seat selected</Alert>);
      setTimeout(() => setAlert(''), 3000);
      return;
    }

    const json = {
      userId: cookies.get('_id'),
      seats: selectedSeats,
      filmId: idFilm,
    };

    fetch('/api/orderSeat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(json),
    }).then((res) => {
      if (res.status === 200) {
        setAlert(<Alert type='success'>Order success</Alert>);
        setTimeout(() => setAlert(''), 3000);
      } else {
        setAlert(<Alert type='failed'>Order failed</Alert>);
        setTimeout(() => setAlert(''), 3000);
      }
    });
    setAvalSeats((prev) => {
      const newAvalSeats = [...prev];
      prev.forEach((value, index) => {
        if (selectedSeats.includes(index)) {
          newAvalSeats[index] = 1;
        }
      });
      return newAvalSeats;
    });
    setBalance(balance - film.ticket_price * selectedSeats.length);
    setNavbar(
      <Navbar balance={balance - film.ticket_price * selectedSeats.length} setOrderBalance={setBalance} />
    );
    // setAvalSeats([...avalSeats, ...selectedSeats]);
    setSelectedSeats([]);
  };

  return (
    <>
      {/* <Navbar setBalanceBook={setBalance} BalanceBook={balance} /> */}
      <Head>
        <title>{film.title}</title>
      </Head>
      {navbar}
      <Back/>
      <div className='flex items-center justify-around max-sm:column-2 flex-wrap pt-3'>
        {alert}
        <div className='basis-1/6 justify-items-center max-sm:basis-1/2'>
          <img
            src={film.poster_url}
            alt='Movie Poster'
            width={200}
            height={200}
          />
          Ticket price: Rp. {film.ticket_price}
        </div>
        <div className=' basis-2/5 max-sm:basis-1/2'>
          <h1 className=' font-bold'>{film.title}</h1>
          <div>{film.release_date}</div>
          <p>
            {film.description}
            <br></br>
            Age rating: {film.age_rating}
          </p>
        </div>
        <div>
          <h1 className='text-center text-2xl font-bold mb-4'>Seat Booking</h1>
          <div className='grid grid-cols-8 gap-1 w-full max-w-md mx-auto'>
            {/* {...avalSeats} */}
            {avalSeats.map((value, index) => (
              <button
                key={index}
                className={`p-2  text-sm text-center
                ${
                  value == 0
                    ? 'bg-green-500 cursor-pointer'
                    : 'bg-red-500 default-cursor'
                }
                ${selectedSeats.includes(index) && 'bg-sky-500'}
                `}
                onClick={() => handleSeatClick(index)}
                disabled={value != 0 || userAge < film.age_rating}
              >
                {index + 1}
              </button>
            ))}
          </div>
          Selected Seats: {selectedSeats.map((value) => value + 1).join(', ')}
          <div className=''>
            Total: Rp.{selectedSeats.length * film.ticket_price}
          </div>
          <div className='pt-4'>
            <Button
              type='submit'
              onClick={handleOrderClick}
              disabled={userAge < film.age_rating}
            >
              Order
            </Button>
            {userAge < film.age_rating ? (
              <div className='text-center text-red-200 bg-red-500 rounded-md opacity-90 m-2 p-2'>
                You are not old enough to watch this movie
                <br />
                You need to be {film.age_rating} years old and you are{' '}
                {Math.floor(userAge)} years old
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
