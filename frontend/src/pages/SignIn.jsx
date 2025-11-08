import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Container, Alert } from '@mui/material';

// test credentials
const TEST_USERS = {
  'user': { password: '1234', isAdmin: false },
  'ADMIN': { password: 'a1234', isAdmin: true },
};

export default function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // validate credentials
    const user = TEST_USERS[username];
    if (!user || user.password !== password) {
      setError('Invalid username or password');
      return;
    }

    // toggle variable to track if user is admin
    const isAdmin = user.isAdmin;

    // store user info in localStorage
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('username', username);
    localStorage.setItem('isAdmin', isAdmin.toString());

    // trigger a custom event to notify other components of auth change
    window.dispatchEvent(new Event('storage'));

    // redirect based on role
    if (isAdmin) {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4" gutterBottom>
          Sign In
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

