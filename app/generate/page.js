"use client";

import { useState } from "react";
import {
  Container,
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
import { useUser } from "@clerk/nextjs";
import { collection, doc, getDoc, writeBatch } from "firebase/firestore";

export default function Generate() {
  const [text, setText] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [setName, setSetName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useUser();

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
        // body: text,
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
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Generate Flashcards
        </Typography>
        <TextField
          label="Enter your text here..."
          variant="outlined"
          fullWidth
          value={text}
          multiline
          rows={4}
          sx={{ mb: 2 }}
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
          fullWidth
          sx={{
            border: "4px solid #f89090",
            backgroundColor: "#676767", // Custom background color
            color: "#FFFFFF", // Custom text color
            "&:hover": {
              backgroundColor: "#f89090", // Custom hover background color
            },
          }}
        >
          Generate Flashcards
        </Button>
      </Box>

      {/* Flashcard display that has a grid of cards, each representing a flashcard with its front and back content*/}
      {flashcards.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Generated Flashcards
          </Typography>
          <Grid container spacing={2}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: "300px", // Set a fixed height
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
                    fontFamily: "Arial, sans-serif",
                  }}
                  onClick={() => handleCardClick(index)}
                >
                  <CardContent>
                    <Typography>
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
  );
}
