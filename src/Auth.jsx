import { useState } from 'react';
import { supabase } from './supabaseClient';
import { Button, TextField, Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ThemeSwitcher from './ThemeSwitcher';

export default function Auth({ onLogin, darkMode, setDarkMode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSignup = async () => {
    setError('');
    setMessage('');

    const redirectTo = import.meta.env.VITE_REDIRECT_URL || `${window.location.origin}/stressi`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectTo
      }
    });
    
    if (error) {
      setError(error.message);
    } else {
      setMessage('Please check your email to confirm registration');
    }
  };

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else onLogin();
  };

  const handleGoogleLogin = async () => {
    const redirectTo = import.meta.env.VITE_REDIRECT_URL || `${window.location.origin}/stressi`;

    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo
      }
    });
  };

  return (
    <Box>
      <ThemeSwitcher darkMode={darkMode} setDarkMode={setDarkMode} />
      <Box display="flex" flexDirection="column" gap={2} maxWidth="300px" margin="auto" mt={5}>
        <Typography variant="h5">Login / Register</Typography>
        <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <Typography color="error">{error}</Typography>}
        {message && <Typography color="primary">{message}</Typography>}
        <Button variant="contained" onClick={handleLogin}>Log In</Button>
        <Button variant="outlined" onClick={handleSignup}>Register</Button>
        <Button variant="outlined" onClick={handleGoogleLogin}>Login with Google</Button>
      </Box>
    </Box>
  );
}