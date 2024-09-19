import { useState, useEffect } from 'react'

const AuthForm = ({ authAction, mode='login' })=> {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async(ev) => {
    ev.preventDefault();
    try {
      await authAction({ username, password }, mode);
    }
    catch(ex){
      setError(ex.error);
    }
  }
  return (
    <form onSubmit={ submit }>
      { !!error && <div className='error'>{ error }</div> }
      <input value={ username } placeholder='Username' onChange={ ev=> setUsername(ev.target.value)}/>
      <input value={ password} placeholder='Password' onChange={ ev=> setPassword(ev.target.value)}/>
      <button>{ mode }</button>
    </form>
  );
}

export default AuthForm;
