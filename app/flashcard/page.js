"use client"; 
import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import {
  Container,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Box,
  Typography,
} from "@mui/material";
import { collection, doc, getDocs } from "firebase/firestore";
import { useSearchParams } from "next/navigation";
import { db } from "../../firebase.js";
import "../globals.css";
// Import your Firebase setup here
// This component uses Clerk’s `useUser` hook for authentication, React’s `useState`
// for managing the flashcardsand their flip states
// and Next.js’s `useSearchParams` to get the flashcard set ID from the URL
export default function Flashcard() {
  const { user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});

  const searchParams = useSearchParams();
  const search = searchParams.get("id");

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // useEffect` hook helps to fetch the specific flashcard set when the component mounts
  // or when the user or search parameter changes
  useEffect(() => {
    // This function retrieves all flashcards in the specified set from Firestore and updates the `flashcards` state.
    async function getFlashcard() {
      if (!search || !user) return;
      // Construct a reference to the Firestore collection where the flashcards are stored
      const colRef = collection(doc(collection(db, "users"), user.id), search);
      // Retrieve all documents from the collection reference, and push them to flashcards array
      const docs = await getDocs(colRef);
      const flashcards = [];
      docs.forEach((doc) => {
        flashcards.push({ id: doc.id, ...doc.data() });
      });
      setFlashcards(flashcards);
    }
    getFlashcard();
  }, [search, user]);

  // The component renders a grid of flashcards.
  // Each flashcard is displayed as a card that flips when clicked, revealing the back of the card.
  // The flip animation is achieved using CSS transforms and transitions.
  return (
    <Container
      maxWidth="md"
      className="responsive-font-size responsive-padding"
    >
      <Grid container spacing={3} sx={{ mt: 4 }}>
        {flashcards.map((flashcard) => (
          <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
            <Card>
              <CardActionArea onClick={() => handleCardClick(flashcard.id)}>
                <CardContent>
                  <Box
                    sx={
                      {
                        /* Styling for flip animation */
                      }
                    }
                  >
                    <div>
                      <div>
                        <Typography variant="h5" component="div">
                          {flashcard.front}
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="h5" component="div">
                          {flashcard.back}
                        </Typography>
                      </div>
                    </div>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
