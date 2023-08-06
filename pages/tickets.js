import Navbar from '@/components/Navbar';
import TicketCard from '@/components/TicketCard';
import { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import Button from '../app/components/Button';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Back from '@/components/Back';
import Head from 'next/head';
import Alert from '@/components/Alert';
import Image from 'next/image';

export default function pages() {
  const [history, setHistory] = useState([]);
  const [films, setFilms] = useState([]);
  const [balance, setBalance] = useState(0);
  const [navbar, setNavbar] = useState(
    <Navbar setOrderBalance={setBalance} refundBalance={balance} />
  );
  const [alert, setAlert] = useState('');

  const router = useRouter();
  const cookies = new Cookies();
  useEffect(() => {
    if (!cookies.get('_id')) {
      router.push('/');
    }

    fetch('/api/getFilm')
      .then((res) => res.json())
      .then((films) => {
        setFilms(films);
        fetch('/api/getHistory/' + cookies.get('_id'))
          .then((res) => res.json())
          .then((json) => {
            if (json.message == 'History not found') return setHistory([]);
            json = json.map((v) => {
              v.description = films.find((f) => f._id == v.film_id);
              return v;
            });
            setHistory(json);
          });
      });
  }, []);

  const handleRefund = (id) => {
    let body = {
      _id: id,
    };

    const opt = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    };

    fetch('/api/refund', opt)
      .then((res) => res.json())
      .then((json) => {
        setBalance(
          balance +
            films.find((v) => v._id == history.find((v) => v._id == id).film_id)
              .ticket_price
        );
        setNavbar(
          <Navbar
            setOrderBalance={setBalance}
            refundBalance={
              balance +
              films.find(
                (v) => v._id == history.find((v) => v._id == id).film_id
              ).ticket_price
            }
          />
        );
        setAlert(<Alert type='success'> Refund success </Alert>);
        setTimeout(() => {
          setAlert('');
        }, 2000);
      })
      .catch((err) => {
        setAlert(<Alert type='failed'> Refund failed </Alert>);
        setTimeout(() => {
          setAlert('');
        }, 2000);
      });

    setHistory(history.filter((v) => v._id != id));
  };

  return (
    <>
      {navbar}
      <Head>
        <title>Tickets</title>
      </Head>
      <div className='flex justify-center'>
        {alert}
        <div className='flex flex-col justify-center place-items-center m-2'>
          <div className='text-2xl'>Tickets</div>
          {history.length == 0 ? (
            <div className='text-md opacity-80'>You don't have any tickets</div>
          ) : (
            <>
              <div className='text-md opacity-80'>Here is your tickets</div>
              <div className='text-md opacity-80'>
                You have {history.length} tickets
              </div>
            </>
          )}
        </div>
      </div>

      <Back />

      <TicketCard history={history}/>
    </>
  );
}
