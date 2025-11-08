import React, { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const IMAGES = [
  "https://irp.cdn-website.com/ddaa10dc/dms3rep/multi/LBF+Hero+Abby+Cafiero+in+a+filed+of+flowers.png",
  "https://irp.cdn-website.com/ddaa10dc/dms3rep/multi/Abby+Brown+eating+watermelon.jpeg",
  "https://irp.cdn-website.com/ddaa10dc/dms3rep/multi/LBF+Hero+Ashton+Hawkings+lying+in+hospital+bed.png",
  "https://irp.cdn-website.com/ddaa10dc/dms3rep/multi/LBF+Hero+Jack+Rolle+at+a+sports+event.png",
];

export default function SignUp() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [slide, setSlide] = useState(0);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setSlide((s) => (s + 1) % IMAGES.length);
    }, 7000);
    return () => clearInterval(t);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password) {
      setError("Please provide a username and password.");
      return;
    }

    setSubmitting(true);
    try {
      // simple local signup storage for dev/testing
      const users = JSON.parse(localStorage.getItem("appUsers") || "[]");
      if (users.find((u) => u.username === username.trim())) {
        throw new Error("Username already exists.");
      }
      users.push({ username: username.trim(), password });
      localStorage.setItem("appUsers", JSON.stringify(users));

      // show popup success
      setOpenSuccess(true);
    } catch (err) {
      setError(err.message || "Sign up failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGotoSignIn = () => {
    setOpenSuccess(false);
    navigate("/signin");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 4,
      }}
    >
      {/* Left slideshow */}
      <Box
        sx={{
          flex: "1 1 60%",
          display: { xs: "none", md: "block" },
          position: "relative",
          overflow: "hidden",
          minHeight: "100vh",
        }}
      >
        {IMAGES.map((src, idx) => (
          <Box
            key={src}
            sx={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              transition: "opacity 900ms ease",
              opacity: idx === slide ? 1 : 0,
              filter: "saturate(0.98) contrast(0.98)",
            }}
            aria-hidden
          />
        ))}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.28) 100%)",
          }}
        />
      </Box>

      {/* Right form area */}
      <Box
        sx={{
          width: { xs: "100%", md: 480 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
        }}
      >
        <Card sx={{ width: "100%", borderRadius: 2, boxShadow: 6 }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Box sx={{ textAlign: "center", mb: 2 }}>
              <img
                src="/Lilabean-Logo-Transparent.png"
                alt="Lilabean"
                style={{ height: 64, marginBottom: 8 }}
              />
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Create an account
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Sign up with a username and password
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: "grid", gap: 2, mt: 1 }}
            >
              <TextField
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
                required
                autoComplete="username"
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
                autoComplete="new-password"
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={submitting}
                sx={{ py: 1.25, mt: 1, fontWeight: 700 }}
              >
                {submitting ? "Creating..." : "Sign up"}
              </Button>
            </Box>

            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{" "}
                <RouterLink to="/signin" style={{ textDecoration: "none" }}>
                  <Typography
                    component="span"
                    sx={{ color: "primary.main", fontWeight: 700 }}
                  >
                    Sign in
                  </Typography>
                </RouterLink>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Dialog open={openSuccess} onClose={() => setOpenSuccess(false)}>
        <DialogTitle>Account created</DialogTitle>
        <DialogContent>
          <Typography>
            Account created successfully. You can now sign in.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSuccess(false)}>Close</Button>
          <Button onClick={handleGotoSignIn} variant="contained">
            Go to Sign in
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}