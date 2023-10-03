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
import Image from 'next/image';

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
  const [navbar, setNavbar] = useState(
    <Navbar balance={0} setOrderBalance={setBalance} />
  );
  const [isFilmReady, setIsFilmReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
        setIsFilmReady(true);
      });

    fetch('/api/getUser/' + cookies.get('_id'))
      .then((res) => res.json())
      .then((data) => {
        setBalance(data.balance);
        setUserAge((new Date().getTime() - data.birthDate) / 31536000000);
        setNavbar(
          <Navbar balance={data.balance} setOrderBalance={setBalance} />
        );
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
      <Navbar
        balance={balance - film.ticket_price * selectedSeats.length}
        setOrderBalance={setBalance}
      />
    );
    setSelectedSeats([]);
  };

  return (
    <>
      <Head>
        <title>{film.title}</title>
      </Head>
      {isLoading && (
        <div className='fixed h-screen w-full bg-[#1e1b4b]'>
          <div className='flex justify-center items-center h-screen'>
            <svg
              aria-hidden='true'
              className='inline w-6 h-6 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300'
              viewBox='0 0 100 101'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                fill='currentColor'
              />
              <path
                d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                fill='currentFill'
              />
            </svg>
            <p className='text-2xl font-bold'>Loading...</p>
          </div>
        </div>
      )}
      <div onLoad={() => setIsLoading(false)}>
        {isFilmReady && (
          <>
            {navbar}
            <Back />
            <div className='flex items-center justify-around max-sm:column-2 flex-wrap pt-3'>
              {alert}
              <div className='basis-1/6 justify-items-center max-sm:basis-1/2'>
                <Image
                  alt='Movie Poster'
                  width={200}
                  height={300}
                  src={film.poster_url}
                  quality={100}
                  placeholder='blur'
                  blurDataURL='/blur.png'
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
                <h1 className='text-center text-2xl font-bold mb-4'>
                  Seat Booking
                </h1>
                <div className='grid grid-cols-8 gap-1 w-full max-w-md mx-auto'>
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
                Selected Seats:{' '}
                {selectedSeats.map((value) => value + 1).join(', ')}
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
        )}
      </div>
    </>
  );
}
