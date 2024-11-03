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
import Link from "next/link";
import LibraryBookIcon from "@mui/icons-material/LibraryBooks";
import CreateIcon from "@mui/icons-material/Create";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";

export default function SignUpPage() {
  // ... (component body)
  return (
    <Box
    sx={{
      my: (-1),
      display: "flex",
      minHeight: "10vh",
      flexDirection: "column",
      marginLeft: "-18px",
      marginBottom: "18px",
      backgroundColor: "#d9dde8",
      justifyContent: "space-between",
      width: "100.7%",
      paddingBottom: "50vh",
    }}>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#d9dde8",
        }}
      >
        <Toolbar>
        <Button
            sx={{
              gap: 2,
              "&:hover": {
                backgroundColor: "#FFF", // Custom hover background color
              },
            }}
            href="/"
          >
            <LibraryBookIcon sx={{ color: "#000", fontSize: 32 }} />
          </Button>
          <Typography
            variant={"h4"}
            color={"#000"}
            sx={{
              flexGrow: 1,
              fontFamily: `'Mont Hairline', italic`,
              fontWeight: "800",
            }}
          >
            Study Stash
          </Typography>
          <SignedOut>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Button
                variant="contained"
                sx={{
                  border: "4px solid #4255ff",
                  backgroundColor: "#4255ff", // Custom background color
                  color: "#FFFFFF", // Custom text color
                  "&:hover": {
                    backgroundColor: "#4255ff", // Custom hover background color
                    
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
                  border: "4px solid #4255ff",
                  backgroundColor: "#4255ff", // Custom background color
                  color: "#FFFFFF", // Custom text color
                  "&:hover": {
                    backgroundColor: "#4255ff", // Custom hover background color
                  },
                }}
                href="/sign-up"
              >
                Sign Up
              </Button>
            </Box>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{ textAlign: "center", my: 30, color: "black"}}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Sign Up
        </Typography>
        <SignUp />
      </Box>
    </Box>
  );
}
