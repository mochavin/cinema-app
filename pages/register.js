// register page

import Alert from '@/components/Alert.js';
import Button from '@/components/Button.js';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';

export default function register() {
  const [isClick, setIsClick] = useState(false);
  const [alert, setAlert] = useState('');
  const [name, setName] = useState('');
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [pass2, setPass2] = useState('');
  const [birth, setBirth] = useState('');

  // listen keypress
  useEffect(() => {
    const handleEnter = (e) => {
      if (e.key === 'Enter') {
        registerClick();
      }
    };

    window.addEventListener('keypress', handleEnter);

    return () => {
      window.removeEventListener('keypress', handleEnter);
    };
  }, [user, pass, pass2, birth]);

  const cookies = new Cookies();
  const route = useRouter();

  const clearAlert = () => {
    setTimeout(() => {
      setAlert('');
    }, 2000);
  };

  const register = async (name, user, pass, pass2, birth) => {
    let body = {
      name: name,
      username: user,
      password: pass,
      confirmPassword: pass2,
      birthDate: new Date(birth).getTime()
    };

    const opt = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    };

    let res = await fetch('/api/addUser', opt);
    let json = await res.json();
    return json;
  };

  const registerClick = () => {
    setIsClick(true);
    if (pass !== pass2) {
      setIsClick(false);
      setAlert(<Alert type='failed'>Password not match</Alert>);
      return clearAlert();
    }
    if (name == '' || user === '' || pass === '' || pass2 === '' || birth === '') {
      setIsClick(false);
      setAlert(<Alert type='failed'>Please fill all field</Alert>);
      return clearAlert();
    }
    register(name, user, pass, pass2, birth)
      .then((v) => {
        setIsClick(false);
        clearAlert();
        if (!v._id) return setAlert(<Alert type='failed'>{v.message}</Alert>);

        cookies.set('_id', v._id, { path: '/' });
        route.push('/dashboard');

        return setAlert(<Alert type='success'>Register Success</Alert>);
      })
      .catch((e) => {
        setIsClick(false);
      });
  };

  const handleBack = () => {
    route.push('/');
  };

  return (
    <>
      <div className='w-full h-screen flex justify-center static items-center text-slate-900'>
        <div className='absolute bg-white w-full min-[600px]:w-1/2 h-4/5 rounded-md flex flex-col '>
          <div className='flex justify-center font-bold text-4xl border-10 basis-1/3 items-center'>
            Register
          </div>
          <div className='flex justify-center items-center basis-1/2 bg-white flex-col space-y-2'>
            <input
              type='text'
              className='border-2 pl-3 h-10 rounded-md focus:shadow-inner outline-none focus:shadow-blue-500/40'
              placeholder='Your Name'
              onChange={(e) => setName(e.target.value)}
            ></input>
            <input
              type='text'
              className='border-2 pl-3 h-10 rounded-md focus:shadow-inner outline-none focus:shadow-blue-500/40'
              placeholder='Username'
              onChange={(e) => setUser(e.target.value)}
            ></input>
            <input
              type='password'
              className='border-2 pl-3 h-10 rounded-md focus:shadow-inner outline-none focus:shadow-blue-500/40'
              placeholder='Password'
              onChange={(e) => setPass(e.target.value)}
            />
            <input
              type='password'
              className='border-2 pl-3 h-10 rounded-md focus:shadow-inner outline-none focus:shadow-blue-500/40'
              placeholder='Confirm Password'
              onChange={(e) => setPass2(e.target.value)}
            />
            <input
              type='date'
              className='border-2 pl-3 h-10 rounded-md focus:shadow-inner outline-none focus:shadow-blue-500/40'
              placeholder='Birth'
              onChange={(e) => setBirth(e.target.value)}
            />
          </div>
          <div className='flex justify-center basis-1/3 mt-6 flex-col -space-y-4'>
            <div className='basis-1/2 justify-center flex'>
              <Button type='login' onClick={registerClick} disabled={isClick}>
                Register
              </Button>
              {alert}
            </div>
            <div className='basis-1/2 justify-center flex'>
              <Button type='login' onClick={handleBack}>
                Back to Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
