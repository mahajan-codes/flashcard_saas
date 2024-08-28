"use client";

import { useState } from "react";
import {
  Container,
  AppBar,
  Toolbar,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogTitle,
  DialogContent,
  Card,
  CardContent,
} from "@mui/material";
import { db } from "../../firebase";
import { UserButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { collection, doc, getDoc, writeBatch } from "firebase/firestore";
import LibraryBookIcon from "@mui/icons-material/LibraryBooks";

export default function Generate() {
  const [text, setText] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [setName, setSetName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useUser();

  const [flashcardsGenerated, setFlashcardsGenerated] = useState(false);
  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);
  const [flippedCards, setFlippedCards] = useState({});

  // Save the flashcards in the firebase
  const saveFlashcards = async () => {
    if (!setName.trim()) {
      alert("Please enter a name for your flashcard set.");
      return;
    }

    try {
      const userDocRef = doc(collection(db, "users"), user.id);
      console.log(`userDocRef: ${userDocRef}`);
      const userDocSnap = await getDoc(userDocRef);

      const batch = writeBatch(db);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const updatedSets = [
          ...(userData.flashcardSets || []),
          { name: setName },
        ];
        batch.update(userDocRef, { flashcardSets: updatedSets });
      } else {
        batch.set(userDocRef, { flashcardSets: [{ name: setName }] });
      }

      const setDocRef = doc(collection(userDocRef, "flashcardSets"), setName);
      batch.set(setDocRef, { flashcards });

      await batch.commit();

      alert("Flashcards saved successfully!");
      handleCloseDialog();
      setSetName("");
    } catch (error) {
      console.error("Error saving flashcards:", error);
      alert("An error occurred while saving flashcards. Please try again.");
    }
  };

  const handleSubmit = async () => {
    // It checks if the input text is empty and shows an alert if it is.
    if (!text.trim()) {
      alert("Please enter some text to generate flashcards.");
      return;
    }

    try {
      // send a POST request to our `/api/generate` endpoint with the input text.
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }), // Send the text as a JSON object
      });

      if (!response.ok) {
        throw new Error("Failed to generate flashcards");
      }

      const data = await response.json();
      setFlashcards(data);
      setFlashcardsGenerated(true);
    } catch (error) {
      console.error("Error generating flashcards:", error);
      alert("An error occurred while generating flashcards. Please try again.");
    }
  };
  const handleCardClick = (index) => {
    setFlippedCards((prev) => ({
      ...prev,
      [index]: !prev[index], // Toggle the flipped state for the clicked card
    }));
  };

  return (
    <Box
    sx={{
      my: 0,
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#d9dde8",
    }}>
      {/* Header and Navbar */}
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#d9dde8",
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
            <LibraryBookIcon sx={{ color: "#000", fontSize: 32 }} />
          </Button>
          <Typography
            variant={"h4"}
            color={"#000"}
            sx={{
              flexGrow: 1,
              fontFamily: `'Mont Hairline', italic`,
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
              <Button
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
              </Button>
            </Box>
          </SignedOut>
          <SignedIn>
            <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
              <Button
                color="inherit"
                variant="contained"
                sx={{
                  border: "4px solid #4255ff",
                  backgroundColor: "#4255ff",
                  color: "#FFFFFF",
                  "&:hover": {
                    backgroundColor: "#4255ff",
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
                  border: "4px solid #4255ff",
                  backgroundColor: "#4255ff",
                  color: "#FFFFFF",
                  "&:hover": {
                    backgroundColor: "#4255ff",
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
      {/* The generate textfield box */}
      <Container>
        <Box
          sx={{
            border: "4px solid #000",
            backgroundColor: "black",
            my: 20, // a margin of 32px (4 * 8px) on both the top and bottom of the component
            // width: "1200px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            p: 10,
            marginTop: flashcardsGenerated ? "10vh" : "20vh", // Adjust based on state
            mx: "auto", // Centers horizontally in the viewport
          }}
        >
          <TextField
            label="Enter your text here..."
            variant="outlined"
            fullWidth
            value={text}
            multiline
            rows={4}
            sx={{ my: 2, width: "1000px" }}
            onChange={(e) => setText(e.target.value)}
            InputProps={{
              style: { color: "#FFFFFF", backgroundColor: "#333" }, // Darker input field
            }}
            InputLabelProps={{
              style: { color: "#BBBBBB" }, // Light label color
            }}
          />
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              mb: 0,
              border: "4px solid #4255ff",
              width: "1000px",
              backgroundColor: "#4255ff", // Custom background color
              color: "#FFFFFF", // Custom text color
              "&:hover": {
                backgroundColor: "#4255ff", // Custom hover background color
              },
            }}
          >
            Generate Flashcards
          </Button>
        </Box>
        {/* Flashcard display that has a grid of cards, each representing a flashcard with its front and back content*/}
        {flashcards.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography
              variant="h5"
              component="h2"
              alignContent={"center"}
              gutterBottom
            >
              Generated Flashcards
            </Typography>
            <Grid container spacing={2}>
              {flashcards.map((flashcard, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    sx={{
                      height: "250px", // Set a fixed height
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      transformStyle: "preserve-3d",
                      transform: flippedCards[index]
                        ? "perspective(1000px) rotateY(360deg)"
                        : "perspective(1000px) rotateY(0deg)",
                      cursor: "pointer", // indicates the card is clickable
                      transition: "transform 0.8s ease-in-out",
                      border: "4px solid #f89090",
                      backgroundColor: flippedCards[index]
                        ? "#676767"
                        : "#fafafa", // Change the background color based on the flip state
                      color: flippedCards[index] ? "#fafafa" : "#333", // Set text color
                    }}
                    onClick={() => handleCardClick(index)}
                  >
                    <CardContent
                      sx={{
                        display: "flex",
                        justifyContent: "center", // Center horizontally within the CardContent
                        alignItems: "center", // Center vertically within the CardContent
                        height: "100%", // Full height to center vertically
                        padding: 2,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "20px",
                          fontWeight: flippedCards[index] ? "normal" : "bold",
                          // p: 10,
                        }}
                      >
                        {flippedCards[index] ? flashcard.back : flashcard.front}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Save flashcard button */}
        {flashcards.length > 0 && (
          <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              onClick={handleOpenDialog}
              sx={{
                border: "4px solid #f89090",
                backgroundColor: "#676767", // Custom background color
                color: "#FFFFFF", // Custom text color
                "&:hover": {
                  backgroundColor: "#f89090", // Custom hover background color
                },
              }}
            >
              Save Flashcards
            </Button>
          </Box>
        )}
        {/* dialog component for naming and saving the flashcard set: */}
        <Dialog open={dialogOpen} onClose={handleCloseDialog}>
          <DialogTitle>Save Flashcard Set</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter a name for your flashcard set.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Set Name"
              type="text"
              fullWidth
              value={setName}
              onChange={(e) => setSetName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={saveFlashcards} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
