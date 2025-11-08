import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Slider,
  Typography,
  Grow,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useState, useEffect, useRef } from "react";
import { researchData } from "../data/researchData.js";

// container wrapper to center everything and add some padding
const Container = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: "1200px",
  margin: "0 auto",
}));

// box around the slider to give it a nice background and spacing
const SliderContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 2),
  backgroundColor: "transparent",
  marginBottom: theme.spacing(4),
  position: "relative",
}));

// container for the slider with relative positioning for the year label
const SliderWrapper = styled(Box)({
  position: "relative",
  paddingBottom: "18px", // a bit more space for the year label below
  // hint to the browser that we'll animate these properties
  willChange: "left, transform, opacity",
});

// styled component for the year label positioned below the thumb
const YearLabel = styled(Typography)(({ position }) => ({
  position: "absolute",
  bottom: "-5px",
  left: `calc(${position}% - 20px)`, // center the label under the thumb
  fontWeight: "bold",
  fontSize: "1.1rem",
  color: "#000",
  pointerEvents: "none",
  minWidth: "40px",
  textAlign: "center",
  // slower, smoother transition when the slider moves
  transition:
    "left 520ms cubic-bezier(0.2, 0, 0.2, 1), transform 520ms cubic-bezier(0.2,0,0.2,1), opacity 300ms",
}));

// grid container for research tiles
const TilesGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: theme.spacing(3),
  marginTop: theme.spacing(4),
}));

// styled research tile card
const ResearchTile = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  background: "#ffffff",
  border: "1px solid #e0e0e0",
  borderRadius: "12px",
  transition: "all 0.3s ease-in-out",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  "&:hover": {
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  },
}));

// simple count-up component for money values
function MoneyCount({ amount, duration = 1200 }) {
  const [value, setValue] = useState(0);
  const startRef = useRef(null);
  const rafRef = useRef(null);

  // parse numeric value from string or number input
  const target =
    typeof amount === "number"
      ? amount
      : Number(String(amount).replace(/[^\d.-]/g, "")) || 0;

  useEffect(() => {
    let cancelled = false;
    startRef.current = null;

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const step = (timestamp) => {
      if (cancelled) return;
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const current = Math.round(target * eased);
      setValue(current);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    // start animation
    rafRef.current = requestAnimationFrame(step);

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return <>{`$${value.toLocaleString()}`}</>;
}

// Export a reusable ResearchTile component for preview
export function ResearchTileCard({ title, impact, money, summary }) {
  return (
    <ResearchTile>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {impact}
        </Typography>
        <Typography
          variant="h6"
          color="primary"
          sx={{ mb: 2, fontWeight: "bold" }}
        >
          <MoneyCount amount={money} />
        </Typography>
        {summary && (
          <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
            {summary}
          </Typography>
        )}
      </CardContent>
    </ResearchTile>
  );
}

export default function ResearchTimeline({ selectedYear, setSelectedYear }) {
  // use props if provided, otherwise use local state
  const [localYear, setLocalYear] = useState(2012);
  const currentYear = selectedYear !== undefined ? selectedYear : localYear;
  const updateYear = setSelectedYear || setLocalYear;

  // track which tile's popup is open (null if none)
  const [openTileId, setOpenTileId] = useState(null);

  // controls for smooth staggered animation of tiles on year change
  const [showTiles, setShowTiles] = useState(true);
  useEffect(() => {
    // slightly longer hide so the re-entry animations feel smoother
    setShowTiles(false);
    const t = setTimeout(() => setShowTiles(true), 140);
    return () => clearTimeout(t);
  }, [currentYear]);

  // update the selected year when user moves the slider
  const handleSliderChange = (event, newValue) => {
    updateYear(newValue);
  };

  // calculate the position percentage for the year label
  const min = 2012;
  const max = 2025;
  const position = ((currentYear - min) / (max - min)) * 100;

  // handle opening the popup
  const handleOpenPopup = (tileId) => {
    setOpenTileId(tileId);
  };

  // handle closing the popup
  const handleClosePopup = () => {
    setOpenTileId(null);
  };

  // Get research tiles for a specific year from real data
  const getResearchTiles = (year) => {
    // Filter real research data by year
    const realTilesForYear = researchData
      .filter((tile) => tile.year === year)
      .map((tile) => ({
        id: tile.id,
        title: tile.title,
        impact: tile.impact,
        money: tile.money,
        summary: tile.summary,
      }));

    // Get approved tiles from localStorage (for any manually added projects)
    const approvedTiles = JSON.parse(
      localStorage.getItem("approvedResearchTiles") || "[]"
    );
    const approvedForYear = approvedTiles
      .filter((tile) => tile.year === year)
      .map((tile) => ({
        id: tile.id,
        title: tile.title,
        impact: tile.impact,
        money: tile.money,
        summary: tile.summary,
      }));

    // Combine real data with approved tiles (approved tiles take precedence if same ID)
    const allTiles = [...realTilesForYear, ...approvedForYear];
    // Remove duplicates by ID (keep approved tiles if duplicate)
    const uniqueTiles = Array.from(
      new Map(allTiles.map((tile) => [tile.id, tile])).values()
    );

    return uniqueTiles;
  };

  const researchTiles = getResearchTiles(currentYear);
  const selectedTile = researchTiles.find((tile) => tile.id === openTileId);

  return (
    <Container>
      <Typography
        variant="h4"
        component="h2"
        gutterBottom
        sx={{
          mb: 4,
          fontWeight: 800,
          fontSize: "2.5rem",
          textAlign: "center",
          color: "#000",
        }}
      >
        VIEW DONOR IMPACT
      </Typography>

      <SliderContainer>
        <SliderWrapper>
          <Slider
            value={currentYear}
            onChange={handleSliderChange}
            min={2012}
            max={2025}
            step={1}
            valueLabelDisplay="off"
            sx={{
              color: "#FFEAA7", // butter yellow
              transition: "all 520ms cubic-bezier(0.2,0,0.2,1)",
              "& .MuiSlider-thumb": {
                backgroundColor: "#FFEAA7",
                border: "2px solid rgba(255, 234, 167, 0.8)",
                boxShadow: "0 0 10px rgba(255, 234, 167, 0.5)",
                transition:
                  "transform 520ms cubic-bezier(0.2,0,0.2,1), box-shadow 520ms",
                "&:hover": {
                  boxShadow: "0 0 15px rgba(255, 234, 167, 0.7)",
                },
              },
              "& .MuiSlider-track": {
                backgroundColor: "#FFEAA7",
                border: "none",
                transition: "background-color 520ms",
              },
              "& .MuiSlider-rail": {
                backgroundColor: "rgba(255, 234, 167, 0.3)",
                transition: "background-color 520ms",
              },
            }}
          />
          <YearLabel position={position}>{currentYear}</YearLabel>
        </SliderWrapper>
      </SliderContainer>

      <Box
        sx={{ textAlign: "center", marginTop: "3rem", marginBottom: "2rem" }}
      >
        <Typography
          variant="h2"
          component="h2"
          sx={{
            fontSize: "2rem",
            fontWeight: "700",
            color: "#000",
            margin: 0,
          }}
        >
          Research Initiatives
        </Typography>
      </Box>

      <TilesGrid>
        {researchTiles.map((tile, idx) => (
          <Grow
            key={tile.id}
            in={showTiles}
            style={{
              transformOrigin: "0 0 0",
              transitionDelay: `${idx * 90}ms`,
            }}
            timeout={500 + idx * 90}
          >
            <div>
              <ResearchTile>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="h6"
                    component="h3"
                    gutterBottom
                    sx={{ fontWeight: "bold", color: "#000" }}
                  >
                    {tile.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ mb: 2, color: "rgba(0, 0, 0, 0.7)" }}
                  >
                    {tile.impact}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ mb: 2, fontWeight: "bold", color: "#000" }}
                  >
                    <MoneyCount
                      amount={tile.money}
                      duration={1000 + idx * 80}
                    />
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    fullWidth
                    onClick={() => handleOpenPopup(tile.id)}
                    sx={{
                      background: "#FFEAA7",
                      border: "none",
                      color: "#000",
                      borderRadius: "20px",
                      fontWeight: 600,
                      "&:hover": {
                        background: "#FFEAA7",
                        opacity: 0.9,
                      },
                    }}
                  >
                    View More
                  </Button>
                </CardContent>
              </ResearchTile>
            </div>
          </Grow>
        ))}
      </TilesGrid>

      {/* Popup Dialog with glassy effect */}
      <Dialog
        open={openTileId !== null}
        onClose={handleClosePopup}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: "#ffffff",
            border: "1px solid #e0e0e0",
            borderRadius: "12px",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
          },
        }}
      >
        <DialogTitle
          sx={{
            m: 0,
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#000",
          }}
        >
          {selectedTile?.title}
          <IconButton
            aria-label="close"
            onClick={handleClosePopup}
            sx={{
              color: "rgba(0, 0, 0, 0.7)",
              "&:hover": {
                color: "#000",
                background: "rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          dividers
          sx={{ color: "#000", borderColor: "rgba(0, 0, 0, 0.1)" }}
        >
          <Typography
            variant="body1"
            paragraph
            sx={{ color: "rgba(0, 0, 0, 0.9)" }}
          >
            {selectedTile?.summary}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{ color: "rgba(0, 0, 0, 0.7)" }}
              gutterBottom
            >
              Funding Amount:
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#000" }}>
              <MoneyCount amount={selectedTile?.money || 0} duration={900} />
            </Typography>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{ color: "rgba(0, 0, 0, 0.7)" }}
              gutterBottom
            >
              Impact:
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(0, 0, 0, 0.9)" }}>
              {selectedTile?.impact}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: "1px solid rgba(0, 0, 0, 0.1)" }}>
          <Button
            onClick={handleClosePopup}
            sx={{
              background: "#FFEAA7",
              border: "none",
              color: "#000",
              borderRadius: "20px",
              fontWeight: 600,
              "&:hover": {
                background: "#FFEAA7",
                opacity: 0.9,
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
