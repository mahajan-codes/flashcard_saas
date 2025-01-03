"use client";
import React, { useState, useEffect } from "react";
import { UserButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import {
  Container,
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { collection, doc, getDocs, getDoc } from "firebase/firestore";
import { db } from "../../firebase.js";
import LibraryBookIcon from "@mui/icons-material/LibraryBooks";

export default function Flashcard() {
  const [savedFlashcardSets, setSavedFlashcardSets] = useState([]);
  const [selectedFlashcards, setSelectedFlashcards] = useState([]);
  const [selectedCardSet, setSelectedCardSet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [flippedCards, setFlippedCards] = useState({});
  const { user } = useUser();

  useEffect(() => {
    async function retrieveFlashcardSets() {
      if (!user) return;
      setLoading(true);
      const savedRef = collection(
        doc(collection(db, "users"), user.id),
        "flashcardSets"
      );

      const docs = await getDocs(savedRef);
      const flashcardSets = [];
      docs.forEach((doc) => {
        flashcardSets.push({ id: doc.id, ...doc.data() });
      });
      setSavedFlashcardSets(flashcardSets);
      setLoading(false);
    }

    retrieveFlashcardSets();
  }, [user]);

  useEffect(() => {
    async function getFlashcards() {
      if (!selectedCardSet) return;

      try {
        // Reference to the document that contains the flashcards
        const cardSetRef = doc(
          collection(db, "users", user.id, "flashcardSets"),
          selectedCardSet
        );

        // Retrieve the document
        const cardSetDoc = await getDoc(cardSetRef);

        // Check if the document exists
        if (!cardSetDoc.exists()) {
          console.log(`No such document for card set: ${selectedCardSet}`);
          setSelectedFlashcards([]);
          return;
        }
        console.log(`cardSetDoc: ${JSON.stringify(cardSetDoc)}`);
        // Extract the flashcards field
        const flashcards = cardSetDoc.data().flashcards || [];

        console.log(`Flashcards for set ${selectedCardSet}:`, flashcards);
        setSelectedFlashcards(flashcards);
      } catch (error) {
        console.error("Error fetching flashcards:", error);
      }
    }

    getFlashcards();
  }, [selectedCardSet, user]);

  const handleSetClick = (setId) => {
    setSelectedCardSet(setId);
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
        my: (-1),
        display: "flex",
        minHeight: "10vh",
        flexDirection: "column",
        marginLeft: "-18px",
        marginBottom: "18px",
        backgroundColor: "#d9dde8",
        justifyContent: "space-between",
        width: "100.7%",
        paddingBottom: "60vh",
    }}>

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
                backgroundColor: "#f89090",
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
                  backgroundColor: "#4255ff",
                  color: "#FFFFFF",
                  "&:hover": {
                    backgroundColor: "#4255ff",
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
                  backgroundColor: "#4255ff",
                  color: "#FFFFFF",
                  "&:hover": {
                    backgroundColor: "#4255ff",
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
      <Container>
        {!selectedCardSet ? (
          <Box
            sx={{
              marginTop: "20vh",
              marginLeft: "15vh",
              padding: "32px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 4,
            }}
          >
            <Typography
              variant="h4"
              component="h2"
              alignContent="center"
              gutterBottom
              sx={{
                alignItems: "center",
                fontFamily: `'Mont Hairline', italic`,
                fontWeight: "600",
                fontStyle: "normal",
                textShadow: "6px 6px 6px #d9dde8",
                color: "black",
              }}
            >
              Your Saved Card Sets
            </Typography>
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center">
                <CircularProgress />
              </Box>
            ) : (
              <Grid container spacing={0}>
                {savedFlashcardSets.map((set) => {
                  return (
                    <Grid item xs={12} sm={6} md={4} key={set.id}>
                      <Card
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "250px",
                          cursor: "pointer",
                          border: "4px solid #000",
                          backgroundColor: "#d9dde8",
                          
                        }}
                        onClick={() => handleSetClick(set.id)}
                      >
                        <CardContent>
                          <Typography
                            variant="h5"
                            component="h2"
                            alignContent="center"
                            gutterBottom
                          >
                            {set.name || set.id}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </Box>
        ) : (
          <Box
            sx={{
              marginTop: "5vh",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 4,
              
            }}
          >
            <Typography
              variant="h4"
              component="h2"
              alignContent="center"
              gutterBottom
              sx={{
                fontFamily: `'Mont Hairline', italic`,
                fontWeight: "600",
                fontStyle: "normal",
                textShadow: "6px 6px 6px #d9dde8",
                color: "black",
              }}
            >
              Flashcards in {selectedCardSet}
            </Typography>
            <Grid container spacing={2}>
              {selectedFlashcards.map((flashcard, index) => (
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
                      border: "4px solid #000",
                      backgroundColor: flippedCards[index]
                        ? "#d9dde8"
                        : "#d9dde8", // Change the background color based on the flip state
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
                        color: "black",
                        fontWeight: "300",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "20px",
                          fontWeight: flippedCards[index] ? "normal" : "bold",
                          //p: 100,
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
      </Container>
    </Box>
  );
}
