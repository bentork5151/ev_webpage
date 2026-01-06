// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { Box, Typography, Button, Container } from "@mui/material";
// import { Home, Logout } from "@mui/icons-material";
// import { useAuth } from "../store/AuthContext";

// const ThankYou = () => {
//     const navigate = useNavigate()
//     const { logout } = useAuth()

//     return (
//     <Container maxWidth="sm">
//       <Box
//         display="flex"
//         flexDirection="column"
//         alignItems="center"
//         justifyContent="center"
//         minHeight="100vh"
//         textAlign="center"
//       >
//         <Typography variant="h3" gutterBottom>
//           Thank You!
//         </Typography>
//         <Typography variant="h5" color="text.secondary" paragraph>
//           Thank you for choosing Bentork Charger for charging
//         </Typography>
        
//         <Box display="flex" gap={2} mt={4}>
//           <Button
//             variant="contained"
//             startIcon={<Home />}
//             onClick={() => navigate('/dashboard')}
//           >
//             Go to Dashboard
//           </Button>
//           <Button
//             variant="outlined"
//             startIcon={<Logout />}
//             color="error"
//             onClick={logout}
//           >
//             Logout
//           </Button>
//         </Box>
//       </Box>
//     </Container>
//   )
// }

// export default ThankYou



import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Container } from "@mui/material";
import { useAuth } from "../store/AuthContext";
import ThumbImg from "../assets/images/thankyou.png";

const ThankYou = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      logout();
      navigate("/login");
    }, 5000); // 10 seconds

    return () => clearTimeout(timer);
  }, [logout, navigate]);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          backgroundColor: "rgba(33, 33, 33, 1)"
        }}
      >
        {/* Image */}
        <Box
          sx={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            backgroundColor: "#232425ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 3
          }}
        >
          <img
            src={ThumbImg}
            alt="Thank You"
            style={{ width: 100,
              height:149,
             }}
          />
        </Box>

        {/* Heading */}
        <Typography
          sx={{
            fontSize: "28px",
            fontWeight: 500,
            color: "#ffffffff",
            mb: 1
          }}
        >
          Thank You
        </Typography>

        {/* Subtitle */}
        <Typography
          sx={{
            fontSize: "12px",
            fontWeight: 400,
            color: "#ffffffff"
          }}
        >
          Invoice will be sent on your mail.
        </Typography>

        {/* Footer text */}
        <Typography
          sx={{
            fontSize: "12px",
            color: "rgba(255, 255, 255, 0.5)",
             fontWeight: 400,
            mt: 4
          }}
        >
          Logging Out...
        </Typography>
      </Box>
    </Container>
  );
};

export default ThankYou;
