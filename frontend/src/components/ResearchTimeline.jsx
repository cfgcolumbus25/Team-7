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
  Grow,
  IconButton,
  Slider,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext.jsx";
import { researchAPI } from "../services/api.js";
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
  paddingBottom: "18px", 
  willChange: "left, transform, opacity",
});

// styled component for the year label positioned below the thumb
const YearLabel = styled(Typography)(({ position }) => ({
  position: "absolute",
  bottom: "-5px",
  left: `calc(${position}% - 20px)`, 
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
const ResearchTile = styled(Card)(() => ({
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
  const { user } = useUser();
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredYear, setHoveredYear] = useState(null);
  
  // use props if provided, otherwise use local state
  const [localYear, setLocalYear] = useState(2020);
  const currentYear = selectedYear !== undefined ? selectedYear : localYear;
  const updateYear = setSelectedYear || setLocalYear;
  
  const dashboardLink = user.isAuthenticated ? '/admin' : '/signin';

  // track which tile's popup is open (null if none)
  const [openTileId, setOpenTileId] = useState(null);

  // Research tiles from database
  const [researchTiles, setResearchTiles] = useState([]);
  const [loadingTiles, setLoadingTiles] = useState(false);
  const [tilesError, setTilesError] = useState(null);

  // controls for smooth staggered animation of tiles on year change
  const [showTiles, setShowTiles] = useState(true);
  
  // Fetch research tiles - combine hardcoded data with database data
  useEffect(() => {
    const fetchTiles = async () => {
      setLoadingTiles(true);
      setTilesError(null);
      try {
        // Get hardcoded demo data for this year
        const hardcodedForYear = researchData
          .filter(tile => tile.year === currentYear)
          .map(tile => ({
            id: tile.id,
            title: tile.title,
            impact: tile.impact,
            money: tile.money,
            summary: tile.summary,
            year: tile.year,
            source: 'hardcoded' // mark the source
          }));
        
        // Fetch from database API
        const databaseData = await researchAPI.getAll();
        
        // Filter database data by selected year
        const databaseForYear = databaseData
          .filter(tile => tile.year === currentYear)
          .map(tile => ({
            id: tile.id,
            title: tile.title,
            impact: tile.impact,
            money: tile.money,
            summary: tile.summary,
            year: tile.year,
            source: 'database' // mark the source
          }));
        
        // Combine both sources - hardcoded first, then database
        // Remove duplicates by ID (database takes precedence)
        const allTiles = [...hardcodedForYear, ...databaseForYear];
        const uniqueTiles = Array.from(
          new Map(allTiles.map(tile => [tile.id, tile])).values()
        );
        
        setResearchTiles(uniqueTiles);
      } catch (error) {
        console.error('Failed to fetch research tiles:', error);
        setTilesError(error.message);
        // Fall back to hardcoded data on error
        const hardcodedForYear = researchData
          .filter(tile => tile.year === currentYear)
          .map(tile => ({
            id: tile.id,
            title: tile.title,
            impact: tile.impact,
            money: tile.money,
            summary: tile.summary,
            year: tile.year,
            source: 'hardcoded'
          }));
        setResearchTiles(hardcodedForYear);
      } finally {
        setLoadingTiles(false);
      }
    };

    fetchTiles();
    
    // Trigger animation
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

  const selectedTile = researchTiles.find((tile) => tile.id === openTileId);

  // ---- Edit tile state ----
  const [editingTile, setEditingTile] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);

  // Handler to open edit modal for a tile
  const handleEditTile = (tile) => {
    setEditingTile({
      id: tile.id,
      title: tile.title,
      year: tile.year,
      impact: tile.impact,
      amount: tile.money,
    });
    setShowEditModal(true);
    setOpenTileId(null); // Close the view dialog
  };

  // Handler to save edited tile to Supabase
  const handleSaveEdit = async () => {
    if (!editingTile) return;

    setSavingEdit(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Please log in to edit research tiles');
        return;
      }

      // Update in Supabase via backend API
      const response = await fetch(`http://localhost:8000/api/research/update/${editingTile.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: editingTile.title,
          year: editingTile.year,
          impact: editingTile.impact,
          money: editingTile.amount,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update research tile');
      }

      // Refresh tiles to show updated data
      const fetchTiles = async () => {
        const hardcodedForYear = researchData
          .filter(tile => tile.year === currentYear)
          .map(tile => ({
            id: tile.id,
            title: tile.title,
            impact: tile.impact,
            money: tile.money,
            summary: tile.summary,
            year: tile.year,
            source: 'hardcoded'
          }));
        
        const databaseData = await researchAPI.getAll();
        const databaseForYear = databaseData
          .filter(tile => tile.year === currentYear)
          .map(tile => ({
            id: tile.id,
            title: tile.title,
            impact: tile.impact,
            money: tile.money,
            summary: tile.summary,
            year: tile.year,
            source: 'database'
          }));
        
        const allTiles = [...hardcodedForYear, ...databaseForYear];
        const uniqueTiles = Array.from(
          new Map(allTiles.map(tile => [tile.id, tile])).values()
        );
        
        setResearchTiles(uniqueTiles);
      };
      
      await fetchTiles();
      setShowEditModal(false);
      setEditingTile(null);
      alert("Research tile updated successfully!");
    } catch (error) {
      console.error('Error updating tile:', error);
      alert(`Failed to update tile: ${error.message}`);
    } finally {
      setSavingEdit(false);
    }
  };

  const YEARS = [2020, 2021, 2022, 2023, 2024, 2025];
  const minYear = YEARS[0];
  const maxYear = YEARS[YEARS.length - 1];

  return (
    <div style={{ background: "white", padding: "3rem 1.5rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* VIEW DONOR IMPACT */}
        <Box
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          sx={{ mb: 6, textAlign: "center" }}
        >
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: 800,
              fontSize: "2.5rem",
              textAlign: "center",
              color: "#000",
            }}
          >
            VIEW{" "}
            {isHovered ? (
              <Link
                to={dashboardLink}
                style={{
                  color: "#1565c0",
                  textDecoration: "none",
                  cursor: "pointer",
                  padding: "4px 12px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(21, 101, 192, 0.1)",
                  border: "2px solid #1565c0",
                  transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  display: "inline-block",
                  fontWeight: 800,
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(21, 101, 192, 0.2)";
                  e.currentTarget.style.transform = "scale(1.15) translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(21, 101, 192, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(21, 101, 192, 0.1)";
                  e.currentTarget.style.transform = "scale(1) translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                YOUR
              </Link>
            ) : (
              <span
                style={{
                  color: "#1565c0",
                  padding: "4px 12px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(21, 101, 192, 0.1)",
                  border: "2px solid #1565c0",
                  display: "inline-block",
                  fontWeight: 800,
                }}
              >
                DONOR
              </span>
            )}
            IMPACT
          </Typography>
        </Box>

        {/* Timeline Slider - Add hover effects */}
        <div style={{ position: "relative", margin: "5rem 0", padding: "0 2rem" }}>
          {/* Timeline track with arrows */}
          <div
            style={{
              position: "relative",
              height: "8px",
              background: "linear-gradient(90deg, #e0e7ff 0%, #1e40af 100%)",
              borderRadius: "4px",
              marginBottom: "2rem",
            }}
          >
            {/* Left arrow */}
            <div
              style={{
                position: "absolute",
                left: "-16px",
                top: "50%",
                transform: "translateY(-50%)",
                width: 0,
                height: 0,
                borderTop: "8px solid transparent",
                borderBottom: "8px solid transparent",
                borderRight: "12px solid #e0e7ff",
              }}
            />
            {/* Right arrow */}
            <div
              style={{
                position: "absolute",
                right: "-16px",
                top: "50%",
                transform: "translateY(-50%)",
                width: 0,
                height: 0,
                borderTop: "8px solid transparent",
                borderBottom: "8px solid transparent",
                borderLeft: "12px solid #1e40af",
              }}
            />

            {/* Year markers on the timeline */}
            {YEARS.map((year, idx) => {
              const position = (idx / (YEARS.length - 1)) * 100;
              const isSelected = year === selectedYear;
              const isHovered = hoveredYear === year;
              
              return (
                <div
                  key={year}
                  style={{
                    position: "absolute",
                    left: `${position}%`,
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    cursor: "pointer",
                    zIndex: isSelected ? 10 : isHovered ? 8 : 5,
                  }}
                  onClick={() => setSelectedYear(year)}
                  onMouseEnter={() => setHoveredYear(year)}
                  onMouseLeave={() => setHoveredYear(null)}
                >
                  {/* Marker dot */}
                  <div
                    style={{
                      width: isSelected ? "20px" : isHovered ? "18px" : "14px",
                      height: isSelected ? "20px" : isHovered ? "18px" : "14px",
                      borderRadius: "50%",
                      background: isSelected ? "#1e40af" : isHovered ? "#3b82f6" : "white",
                      border: `3px solid ${isSelected ? "#1e40af" : isHovered ? "#3b82f6" : "#94a3b8"}`,
                      transition: "all 0.3s ease",
                      boxShadow: isSelected
                        ? "0 4px 12px rgba(30, 64, 175, 0.4)"
                        : isHovered
                        ? "0 3px 8px rgba(59, 130, 246, 0.3)"
                        : "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  />
                  
                  {/* Year label */}
                  <div
                    style={{
                      position: "absolute",
                      top: "32px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      fontSize: isSelected ? "16px" : isHovered ? "15px" : "14px",
                      fontWeight: isSelected ? "700" : isHovered ? "650" : "600",
                      color: isSelected ? "#1e40af" : isHovered ? "#3b82f6" : "#64748b",
                      whiteSpace: "nowrap",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {year}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Hidden range input for accessibility */}
          <input
            type="range"
            min={minYear}
            max={maxYear}
            step={1}
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            style={{
              position: "absolute",
              top: 0,
              left: "2rem",
              right: "2rem",
              width: "calc(100% - 4rem)",
              opacity: 0,
              cursor: "pointer",
              height: "40px",
            }}
            aria-label="Select year"
          />
        </div>

        {/* Research tiles display */}
        <Container>
          <Box
            sx={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "2rem",
              boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
              marginTop: "2rem",
            }}
          >
            <Box
              sx={{ textAlign: "center", marginTop: "0", marginBottom: "2rem" }}
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

            {/* Remove loading message, just show tiles or empty state */}
            {tilesError ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="error">
                  Error loading research: {tilesError}
                </Typography>
              </Box>
            ) : researchTiles.length === 0 && !loadingTiles ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No research initiatives found for {currentYear}.
                </Typography>
              </Box>
            ) : (
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
            )}
          </Box>

          {/* Popup Dialog - Remove Close button, keep only Edit for admins */}
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
              {/* Only show Edit button for admins on database tiles */}
              {user?.isAdmin && selectedTile?.source === 'database' && (
                <IconButton
                  aria-label="edit"
                  onClick={() => handleEditTile(selectedTile)}
                  sx={{
                    color: "#2563eb",
                    "&:hover": {
                      color: "#1d4ed8",
                      background: "rgba(37, 99, 235, 0.1)",
                    },
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </IconButton>
              )}
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
      </div>

      {/* Edit Tile Modal */}
      {showEditModal && editingTile && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1200,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowEditModal(false);
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 28,
              width: "90%",
              maxWidth: 600,
              maxHeight: "90vh",
              overflow: "auto",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1),0 10px 10px -5px rgba(0,0,0,0.04)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: "0 0 8px", fontSize: 24, fontWeight: 800, color: "#000" }}>
              Edit Research Tile
            </h3>
            <p style={{ margin: "0 0 24px", color: "#666", fontSize: 14 }}>
              Update the research tile information below.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ display: "block", marginBottom: 6, fontWeight: 600, color: "#000", fontSize: 14 }}>
                  Title:
                </label>
                <input
                  type="text"
                  value={editingTile.title}
                  onChange={(e) => setEditingTile({ ...editingTile, title: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #e0e0e0",
                    borderRadius: 8,
                    fontSize: 14,
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: 6, fontWeight: 600, color: "#000", fontSize: 14 }}>
                  Year:
                </label>
                <input
                  type="number"
                  value={editingTile.year}
                  onChange={(e) => setEditingTile({ ...editingTile, year: parseInt(e.target.value) || new Date().getFullYear() })}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #e0e0e0",
                    borderRadius: 8,
                    fontSize: 14,
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: 6, fontWeight: 600, color: "#000", fontSize: 14 }}>
                  Impact:
                </label>
                <textarea
                  value={editingTile.impact}
                  onChange={(e) => setEditingTile({ ...editingTile, impact: e.target.value })}
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #e0e0e0",
                    borderRadius: 8,
                    fontSize: 14,
                    outline: "none",
                    resize: "vertical",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: 6, fontWeight: 600, color: "#000", fontSize: 14 }}>
                  Amount:
                </label>
                <input
                  type="text"
                  value={editingTile.amount}
                  onChange={(e) => setEditingTile({ ...editingTile, amount: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #e0e0e0",
                    borderRadius: 8,
                    fontSize: 14,
                    outline: "none",
                  }}
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24 }}>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                style={{
                  background: "#fff",
                  border: "1px solid #d1d5db",
                  color: "#374151",
                  padding: "10px 20px",
                  fontSize: 14,
                  fontWeight: 600,
                  borderRadius: 8,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={savingEdit}
                style={{
                  background: savingEdit ? "#93c5fd" : "#2563eb",
                  border: "none",
                  color: "#fff",
                  padding: "10px 20px",
                  fontSize: 14,
                  fontWeight: 600,
                  borderRadius: 8,
                  cursor: savingEdit ? "not-allowed" : "pointer",
                }}
              >
                {savingEdit ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
