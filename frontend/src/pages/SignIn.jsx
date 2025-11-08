import {
  Alert,
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext.jsx";

// test credentials
const TEST_USERS = {
  user: { password: "1234", isAdmin: false },
  ADMIN: { password: "a1234", isAdmin: true },
};

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  // slideshow state (remote image URLs)
  const IMAGES = [
    "https://irp.cdn-website.com/ddaa10dc/dms3rep/multi/LBF+Hero+Abby+Cafiero+in+a+filed+of+flowers.png ",
    "https://irp.cdn-website.com/ddaa10dc/dms3rep/multi/Abby+Brown+eating+watermelon.jpeg",
    "https://irp.cdn-website.com/ddaa10dc/dms3rep/multi/LBF+Hero+Ashton+Hawkings+lying+in+hospital+bed.png",
    "https://irp.cdn-website.com/ddaa10dc/dms3rep/multi/LBF+Hero+Jack+Rolle+at+a+sports+event.png",
  ];
  const [slide, setSlide] = useState(0);
  const navigate = useNavigate();
  const { login } = useUser();

  const handleSignUpRedirect = () => {
    navigate("/signup");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // validate credentials
    const user = TEST_USERS[username];
    if (!user || user.password !== password) {
      setError("Invalid username or password");
      return;
    }

    // toggle variable to track if user is admin
    const isAdmin = user.isAdmin;

    // Use context to update user state (this also updates localStorage)
    login(username, isAdmin);

    // redirect based on role
    if (isAdmin) {
      navigate("/admin");
    } else {
      navigate("/");
    }
  };

  // slideshow effect (stay on each image ~7 seconds)
  useEffect(() => {
    const id = setInterval(() => {
      setSlide((s) => (s + 1) % IMAGES.length);
    }, 7000);
    return () => clearInterval(id);
  }, []);
  return (
    // ensure this page takes full viewport so footer sits below the fold
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 4,
        position: "relative",
      }}
    >
      {/* Back to Overview button */}
      <Box
        sx={{
          position: "absolute",
          top: 24,
          left: 24,
          zIndex: 10,
        }}
      >
        <button
          type="button"
          onClick={() => navigate("/")}
          style={{
            background: "#fff",
            border: "1px solid #e0e0e0",
            color: "#000000",
            padding: "10px 20px",
            fontSize: 14,
            fontWeight: 600,
            borderRadius: 8,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            transition: "all 0.2s ease",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f5f5f5";
            e.currentTarget.style.borderColor = "#d0d0d0";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#fff";
            e.currentTarget.style.borderColor = "#e0e0e0";
          }}
        >
          <span>←</span>
          <span>Back to Overview</span>
        </button>
      </Box>
      {/* Border wrapper that continuously surrounds both sides */}
      <Box
        sx={{
          display: "flex",
          width: "100%",
          maxWidth: 1200,
          border: "1px solid rgba(0,0,0,0.06)",
          borderRadius: 12,
          overflow: "hidden",
          background: "transparent",
        }}
      >
        {/* Left: login form (left side of screen) */}
        <Box
          sx={{
            width: { xs: "100%", md: "60%" },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 4,
          }}
        >
          <Container maxWidth="sm" sx={{ maxWidth: 520 }}>
            <Box sx={{ mb: 4 }}>
              <Typography component="h1" variant="h4" gutterBottom>
                Sign In
              </Typography>
            </Box>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
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
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{
                  "& .MuiInputLabel-root": { 
                    color: "#000000",
                    "&.Mui-focused": { color: "#000000" },
                  },
                  "& .MuiInputBase-input": { color: "#000000" },
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#ffffff",
                    "& fieldset": { borderColor: "#e0e0e0" },
                    "&:hover fieldset": { borderColor: "#b0b0b0" },
                    "&.Mui-focused fieldset": { borderColor: "#1565c0" },
                  },
                }}
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
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{
                  "& .MuiInputLabel-root": { 
                    color: "#000000",
                    "&.Mui-focused": { color: "#000000" },
                  },
                  "& .MuiInputBase-input": { color: "#000000" },
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#ffffff",
                    "& fieldset": { borderColor: "#e0e0e0" },
                    "&:hover fieldset": { borderColor: "#b0b0b0" },
                    "&.Mui-focused fieldset": { borderColor: "#1565c0" },
                  },
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>

              <Box sx={{ textAlign: "center", mt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{" "}
                  <RouterLink to="/signup" style={{ textDecoration: "none" }}>
                    <Typography
                      component="span"
                      sx={{ color: "primary.main", fontWeight: 700 }}
                    >
                      <Button onClick={handleSignUpRedirect}>Sign up</Button>
                    </Typography>
                  </RouterLink>
                </Typography>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Right: image slideshow (smaller photo, centered) */}
        <Box
          sx={{
            width: { xs: "0%", md: "40%" },
            display: { xs: "none", md: "block" },
            position: "relative",
            overflow: "hidden",
            background: "transparent",
          }}
        >
          {IMAGES.map((src, i) => (
            <Box
              key={i}
              component="img"
              src={src}
              alt={`slide-${i}`}
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "90%",
                height: "90%",
                transform: "translate(-50%, -50%)",
                objectFit: "cover",
                borderRadius: 8,
                transition:
                  "opacity 1000ms ease-in-out, transform 1000ms ease-in-out",
                opacity: i === slide ? 1 : 0,
                boxShadow: "none",
              }}
            />
          ))}

          {/* subtle overlay for readability if text appears */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to left, rgba(0,0,0,0.06), rgba(0,0,0,0.02))",
              pointerEvents: "none",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
