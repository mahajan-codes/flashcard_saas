import React from "react";
import {
  Container,
  Box,
  Typography,
  AppBar,
  Toolbar,
  Button,
} from "@mui/material";
import { SignUp, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import LibraryBookIcon from "@mui/icons-material/LibraryBooks";

export default function SignUpPage() {
  // ... (component body)
  return (
    <Box>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#376E6F",
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Button
            sx={{
              gap: 2,
              "&:hover": {
                backgroundColor: "#f89090", // Custom hover background color
              },
            }}
            href="/"
          >
            <LibraryBookIcon sx={{ color: "#2F4454", fontSize: 32 }} />
          </Button>
          <Typography
            variant={"h4"}
            color={"#FFFFFF"}
            sx={{
              flexGrow: 1,
              fontFamily: `'Fredericka the Great', cursive`,
              fontWeight: "200",
            }}
          >
            Study Stash
          </Typography>
          <SignedOut>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Button
                variant="contained"
                sx={{
                  border: "4px solid #DA7B93",
                  backgroundColor: "#2F4454",
                  color: "#fffff",
                  fontWeight: 500,
                  "&:hover": {
                    backgroundColor: "#DA7B93",
                  },
                }}
                href="/sign-in"
              >
                Login
              </Button>
              <Button
                color="inherit"
                variant="contained"
                sx={{
                  border: "4px solid #DA7B93",
                  backgroundColor: "#2F4454",
                  color: "#fffff",
                  fontWeight: 500,
                  "&:hover": {
                    backgroundColor: "#DA7B93",
                  },
                }}
                href="/sign-up"
              >
                Sign Up
              </Button>
            </Box>
          </SignedOut>
          <SignedIn>
            <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
              <Button
                color="inherit"
                variant="contained"
                sx={{
                  border: "4px solid #DA7B93",
                  backgroundColor: "#2F4454",
                  color: "#fffff",
                  fontWeight: 500,
                  "&:hover": {
                    backgroundColor: "#DA7B93",
                  },
                }}
                href="/generate"
              >
                Generate
              </Button>
              <Button
                color="inherit"
                variant="contained"
                sx={{
                  border: "4px solid #DA7B93",
                  backgroundColor: "#2F4454",
                  color: "#fffff",
                  fontWeight: 500,
                  "&:hover": {
                    backgroundColor: "#DA7B93",
                  },
                }}
                href="/saved_cards"
              >
                Saved Cards
              </Button>
              <UserButton />
            </Box>
          </SignedIn>
        </Toolbar>
      </AppBar>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{ textAlign: "center", my: 4 }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Sign Up
        </Typography>
        <SignUp />
      </Box>
    </Box>
  );
}
