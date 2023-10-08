import '@/styles/globals.css';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import Alert from './Alert';
import { useRouter } from 'next/router';
import { Button, Input, Modal } from '@heathmont/moon-core-tw';

export default function Navbar({ refundBalance, setOrderBalance, ...props }) {
  const [accClicked, setAccClicked] = useState(false);
  const [topUpClicked, setTopUpClicked] = useState(false);
  const [withdrawClicked, setWithdrawClicked] = useState(false);
  const cookies = new Cookies();
  const [balance, setBalance] = useState(0);
  const [inputBalance, setInputBalance] = useState(0);
  const [inputWithdraw, setInputWithdraw] = useState(0);
  const [isSuccessTopUp, setIsSuccessTopUp] = useState(false);
  const [user, setUser] = useState('');
  const [alert, setAlert] = useState('');

  const router = useRouter();

  useEffect(() => {
    if (!cookies.get('_id')) {
      router.push('/');
    }

    fetch('/api/getUser/' + cookies.get('_id'))
      .then((res) => res.json())
      .then((json) => {
        if (setOrderBalance) setOrderBalance(json.balance);
        setBalance(json.balance);
        setUser(json.name);
      })
      .then(() => {
        if (props.balance) setBalance(props.balance);
      });
  }, []);

  useEffect(() => {
    setBalance(props.balance);
  }, [props.balance]);

  useEffect(() => {
    setBalance(refundBalance);
  }, [refundBalance]);

  useEffect(() => {
    if (!setOrderBalance) return;
    setOrderBalance(balance);
  }, [balance]);

  const handleTopUp = () => {
    setTopUpClicked(!topUpClicked);
    setAccClicked(false);
  };

  const handleClickWithdraw = () => {
    setWithdrawClicked(!withdrawClicked);
    setAccClicked(false);
  };

  const handleLogOut = () => {
    cookies.remove('_id');
    router.push('/');
  };

  const HandleWithdraw = () => {
    setWithdrawClicked(!withdrawClicked);

    if (inputWithdraw <= 0) {
      setAlert(<Alert type='failed'>Input must be positive</Alert>);
      setTimeout(() => {
        setAlert('');
      }, 2000);
      return;
    }

    if (inputWithdraw > balance) {
      setAlert(<Alert type='failed'>Balance not enough</Alert>);
      setTimeout(() => {
        setAlert('');
      }, 2000);
      return;
    }

    if (inputWithdraw > 500000) {
      setAlert(<Alert type='failed'>Maximum withdraw is 500.000</Alert>);
      setTimeout(() => {
        setAlert('');
      }, 2000);
      return;
    }

    let body = {
      _id: cookies.get('_id'),
      balance: inputWithdraw,
    };

    const opt = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    };

    fetch('/api/withdraw', opt)
      .then((res) => {
        if (res.status == 400) {
          setAlert(<Alert type='failed'>Balance not enough</Alert>);
          setTimeout(() => {
            setAlert('');
          }, 2000);
          throw 'stop';
        }
        return res.json();
      })
      .then((json) => {
        setBalance(json.balance);
        setAlert(<Alert type='success'>Withdraw Success</Alert>);
        setTimeout(() => {
          setAlert('');
        }, 2000);
      });
    // router.reload();
  };

  const HandleTopUpButton = () => {
    setTopUpClicked(!topUpClicked);

    if (inputBalance <= 0) {
      setAlert(<Alert type='failed'>Input must be positive</Alert>);
      setTimeout(() => {
        setAlert('');
      }, 2000);
      return;
    }

    let body = {
      _id: cookies.get('_id'),
      balance: inputBalance,
    };

    const opt = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    };

    fetch('/api/topUp', opt)
      .then((res) => res.json())
      .then((json) => {
        setBalance(json.balance);
        setIsSuccessTopUp(true);
        setTimeout(() => {
          setIsSuccessTopUp(false);
        }, 2000);
      });
    // router.reload();
  };

  const handleClickAccount = () => {
    setAccClicked(!accClicked);
  };

  const handleClickTicket = () => {
    router.push('/tickets');
  };

  return (
    <>
      <div className='flex w-full justify-center items-center'>
        {alert}
        {isSuccessTopUp && (
          <Alert type='success' show={isSuccessTopUp}>
            Top Up Success
          </Alert>
        )}
      </div>
      <div
        className={`grid grid-row fixed top-[72px] right-[4%] h-[300px] w-[14%] max-md:w-40 bg-slate-900 rounded space-y-1 p-1 text-center z-20 ${
          !accClicked && 'hidden'
        } ease-in-out transition-all duration-300`}
      >
        <div className=' bg-slate-800 cursor-default basis-1/6 flex justify-center items-center rounded text-xs font-bold'>
          Balance: {balance}
        </div>
        <div
          className=' bg-slate-800 basis-1/6 flex justify-center items-center rounded text-md font-bold hover:bg-slate-700 cursor-pointer'
          onClick={handleClickTicket}
        >
          Your Ticket
        </div>
        <div
          className=' bg-slate-800 basis-1/6 flex justify-center items-center rounded text-sm font-bold hover:bg-slate-700 cursor-pointer'
          onClick={() => router.push('/history')}
        >
          Transaction History
        </div>
        <div
          className=' bg-slate-800 basis-1/6 flex justify-center items-center rounded text-md font-bold hover:bg-slate-700 cursor-pointer'
          onClick={handleClickWithdraw}
        >
          Withdraw
        </div>
        <Modal open={withdrawClicked} onClose={handleClickWithdraw}>
          <Modal.Backdrop className='bg-black opacity-40' />
          <Modal.Panel className='bg-slate-800 text-white shadow-xl shadow-black gap-4 flex flex-col p-4'>
            <div className='flex w-full text-center justify-center font-bold'>
              <h1>Inputkan nominal Withdraw</h1>
            </div>
            <div className=''>
              <Input
                type='number'
                placeholder=''
                id='custom-style'
                className='bg-slate-700 text-piccolo'
                onChange={(e) => setInputWithdraw(e.target.value)}
              />
            </div>
            <div className='flex items-center justify-center text-white gap-2'>
              <Button
                variant='outline'
                onClick={HandleWithdraw}
                className='bg-blue-500 rounded-xl font-bold'
              >
                Submit
              </Button>
              <Button
                variant='outline'
                onClick={handleClickWithdraw}
                className='bg-slate-700 rounded-xl font-bold'
              >
                Cancel
              </Button>
            </div>
          </Modal.Panel>
        </Modal>

        <div
          className=' text-green-500 animate-pulse cursor-pointer basis-1/6 flex justify-center items-center rounded text-md font-bold hover:scale-110 transition'
          onClick={handleTopUp}
        >
          Top Up
        </div>
        <Modal open={topUpClicked} onClose={handleTopUp}>
          <Modal.Backdrop className='bg-black opacity-40' />
          <Modal.Panel className='bg-slate-800 text-white shadow-xl shadow-black gap-4 flex flex-col p-4'>
            <div className='flex w-full text-center justify-center font-bold'>
              <h1>Inputkan nominal Top Up</h1>
            </div>
            <div className=''>
              <Input
                type='number'
                placeholder=''
                id='custom-style'
                className='bg-slate-700 text-piccolo'
                onChange={(e) => setInputBalance(e.target.value)}
              />
            </div>
            <div className='flex items-center justify-center text-white gap-2'>
              <Button
                variant='outline'
                onClick={HandleTopUpButton}
                className='bg-blue-500 rounded-xl font-bold'
              >
                Submit
              </Button>
              <Button
                variant='outline'
                onClick={handleTopUp}
                className='bg-slate-700 rounded-xl font-bold'
              >
                Cancel
              </Button>
            </div>
          </Modal.Panel>
        </Modal>
        <div
          className=' bg-slate-900 text-red-400 cursor-pointer basis-1/4 flex justify-center items-center rounded text-md font-bold hover:bg-slate-700'
          onClick={handleLogOut}
        >
          Logout
        </div>
      </div>

      <div
        className='flex bg-indigo-950 pr-6 top-0 w-full border-b-2 border-white h-[10%] justify-end sticky items-center space-x-3 z-20'
        onClick={handleClickAccount}
      >
        <div className='flex left-0'>{`Hello, ` + user}</div>
        <div
          className={`mr-2 scale-75 bg-gray-900 rounded-full p-3 cursor-pointer hover:outline-white ${
            accClicked ? 'outline scale-90' : 'outline-none'
          } transition `}
        >
          <svg
            width='30px'
            height='30px'
            viewBox='0 0 24 24'
            id='Layer_1'
            data-name='Layer 1'
            xmlns='http://www.w3.org/2000/svg'
            className='stroke-1 fill-white cursor-pointer'
          >
            <circle className='cls-1' cx='12' cy='7.25' r='5.73' />
            <path
              className='cls-1'
              d='M1.5,23.48l.37-2.05A10.3,10.3,0,0,1,12,13h0a10.3,10.3,0,0,1,10.13,8.45l.37,2.05'
            />
          </svg>
        </div>
      </div>
    </>
  );
}
