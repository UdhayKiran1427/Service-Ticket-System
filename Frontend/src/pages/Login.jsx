import React, { useState } from "react";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        },
      );
      console.log(response.data);
      setOpen(true);
      setError(response?.data || "Login successful!");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error(error.response?.data);
      setOpen(true);
      setError(error.response?.data || "An error occurred during login.");
    }
  }
  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Card
        sx={{
          p: 4,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h4">
          Login
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            mt: 3,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
          autoComplete="off"
        >
          <FormControl fullWidth>
            <Typography variant="body1" gutterBottom>
              Email Address
            </Typography>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                padding: "10px",
                fontSize: "16px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
              required
            />
          </FormControl>
          <FormControl fullWidth>
            <Typography variant="body1" gutterBottom>
              Password
            </Typography>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                padding: "10px",
                fontSize: "16px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
              minLength={6}
              required
            />
          </FormControl>
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              borderRadius: "4px",
              border: "none",
              backgroundColor: "#1976d2",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Login
          </button>
        </Box>
      </Card>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={open}
        autoHideDuration={2000}
      >
        <Alert severity={error?.sucess ? "success" : "error"} variant="filled">
          {error?.message || "An unexpected error occurred."}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Login;
