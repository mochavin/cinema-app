import '@/styles/globals.css';
import Alert from '@/components/Alert.js';
import Button from '@/components/Button.js';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Cookies from 'universal-cookie';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function MyApp() {
  const [isClick, setIsClick] = useState(false);
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [alert, setAlert] = useState('');
  const router = useRouter();
  const cookies = new Cookies();

  // listen keypress
  useEffect(() => {
    const handleEnter = (e) => {
      if (e.key === 'Enter') {
        handleLogin();
      }
    };

    window.addEventListener('keypress', handleEnter);

    return () => {
      window.removeEventListener('keypress', handleEnter);
    };
  }, [user,pass]);

  const login = async (user, pass) => {
    let body = {
      username: user,
      password: pass,
    };

    const opt = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    };

    let res = await fetch('/api/login', opt);
    let json = await res.json();
    return json;
  };

  const handleLogin = () => {
    setIsClick(true);
    login(user, pass)
      .then((v) => {
        setIsClick(false);
        setTimeout(() => {
          setAlert('');
        }, 2000);
        if (!v._id) return setAlert(<Alert type='failed'>{v.message}</Alert>);

        cookies.set('_id', v._id, { path: '/' });
        router.push('/dashboard');

        return setAlert(<Alert type='success'>Login Success</Alert>);
      })
      .catch((e) => {
        setIsClick(false);
      });
  };

  const registerClick = () => {
    router.push('/register');
  };

  useEffect(() => {
    if (cookies.get('_id')) {
      router.push('/dashboard');
    }
  }, []);

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div className='w-full h-screen flex justify-center static items-center text-black'>
        <div className='absolute bg-white w-full min-[600px]:w-1/2 h-3/5 rounded-md flex flex-col '>
          <div className='flex justify-center font-bold text-4xl border-10 basis-1/3 items-center text-slate-900'>
            Login
          </div>
          <div className='flex justify-center items-center basis-1/3 bg-white flex-col space-y-4'>
            <input
              type='text'
              className='border-2 pl-3 h-12 rounded-md focus:shadow-inner outline-none focus:shadow-blue-500/40'
              placeholder='Username'
              onChange={(e) => setUser(e.target.value)}
            ></input>
            <input
              type='password'
              className='border-2 pl-3 h-12 rounded-md focus:shadow-inner outline-none focus:shadow-blue-500/40'
              placeholder='Password'
              onChange={(e) => setPass(e.target.value)}
            />
          </div>
          <div className='flex justify-center basis-1/3 mt-6 flex-col -space-y-2'>
            <div className='basis-1/2 justify-center flex'>
              <Button type='login' onClick={handleLogin} disabled={isClick}>
                Login
              </Button>
              {alert}
            </div>
            <div className='basis-1/2 justify-center flex'>
              <Button type='register' onClick={registerClick}>
                Register
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
