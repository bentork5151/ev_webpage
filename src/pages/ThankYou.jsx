import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Container } from "@mui/material";
import { Home, Logout } from "@mui/icons-material";
import { useAuth } from "../store/AuthContext";

const ThankYou = () => {
    const navigate = useNavigate()
    const { logout } = useAuth()

    return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        textAlign="center"
      >
        <Typography variant="h3" gutterBottom>
          Thank You!
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Thank you for choosing Bentork Charger for charging
        </Typography>
        
        <Box display="flex" gap={2} mt={4}>
          <Button
            variant="contained"
            startIcon={<Home />}
            onClick={() => navigate('/dashboard')}
          >
            Go to Dashboard
          </Button>
          <Button
            variant="outlined"
            startIcon={<Logout />}
            color="error"
            onClick={logout}
          >
            Logout
          </Button>
        </Box>
      </Box>
    </Container>
  )
}

export default ThankYou