"use client";

// MAIN LANDING PAGE
import {
  Button,
  Typography,
  Box,
  Grid,
  AppBar,
  Toolbar,
  Card,
  CardContent,
} from "@mui/material";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import getStripe from "../utils/get-stripe";

export default function Home() {
  // This function handles the Stripe checkout process when a user selects the Pro plan.
  const handleSubmit = async () => {
    const checkoutSession = await fetch("/api/checkout_sessions", {
      method: "POST",
      headers: { origin: "http://localhost:3000" },
    });
    const checkoutSessionJson = await checkoutSession.json();

    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    });

    if (error) {
      console.warn(error.message);
    }
  };

  return (
    <Box>
      {/* Header and Navbar */}
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#1B1B1B",
        }}
      >
        <Toolbar>
          <Typography variant={"h4"} color={"#fff"} sx={{ flexGrow: 1 }}>
            Flashcard Generator
          </Typography>
          <SignedOut>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Button
                variant="contained"
                sx={{
                  border: "4px solid #f89090",
                  backgroundColor: "#676767", // Custom background color
                  color: "#FFFFFF", // Custom text color
                  "&:hover": {
                    backgroundColor: "#f89090", // Custom hover background color
                  },
                }}
                href="/sign-in"
              >
                Login
              </Button>
              {/* <Button
                color="inherit"
                variant="contained"
                sx={{
                  border: "4px solid #f89090",
                  backgroundColor: "#676767", // Custom background color
                  color: "#FFFFFF", // Custom text color
                  "&:hover": {
                    backgroundColor: "#f89090", // Custom hover background color
                  },
                }}
                href="/sign-up"
              >
                Sign Up
              </Button> */}
            </Box>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>
      {/* Hero Section */}
      <Box sx={{ textAlign: "center", my: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Flashcard SaaS
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          The easiest way to create flashcards from your text.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2, mr: 2 }}
          href="/generate"
        >
          Get Started
        </Button>
        <Button variant="outlined" color="primary" sx={{ mt: 2 }}>
          Learn More
        </Button>
      </Box>
      {/* Feature Section */}
      {/* This section highlights the key features of the application, using a grid layout to display them. */}
      <Box
        sx={{
          my: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Box sx={{ marginBottom: "50px" }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Features
          </Typography>
        </Box>
        <Grid
          container
          spacing={4}
          justifyContent="center"
          alignItems="center" // Center items vertically within the grid
          style={{
            backgroundColor: "#000",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <Grid item xs={12} sm={6} md={4}>
            <Typography color={"white"}>Feature 1</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography color={"white"}>Feature 2</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography color={"white"}>Feature 3</Typography>
          </Grid>
        </Grid>
      </Box>
      {/* Pricing Section - This section displays the pricing plans, including a “Pro” plan that uses Stripe for payment processing. */}
      <Box
        sx={{
          my: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Box sx={{ marginBottom: "50px" }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Pricing
          </Typography>
        </Box>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: "300px", // Set a fixed height
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <CardContent>
                <Typography variant="h6" component="div" textAlign={"center"}>
                  Basic Plan
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            sx={{ display: "flex", flexDirection: "column" }}
            gap={4}
          >
            <Card
              sx={{
                height: "300px", // Set a fixed height
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <CardContent>
                <Typography variant="h6" component="div" textAlign={"center"}>
                  Pro Plan
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    border: "4px solid #f89090",
                    backgroundColor: "#676767", // Custom background color
                    color: "#FFFFFF", // Custom text color
                    "&:hover": {
                      backgroundColor: "#f89090", // Custom hover background color
                    },
                  }}
                  onClick={handleSubmit}
                >
                  Upgrade to Pro
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
