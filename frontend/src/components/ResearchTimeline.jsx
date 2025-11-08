import CloseIcon from '@mui/icons-material/Close';
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
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useState } from 'react';


// container wrapper to center everything and add some padding
const Container = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: '1200px',
  margin: '0 auto',
}));

// box around the slider to give it a nice background and spacing
const SliderContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 2),
  backgroundColor: 'transparent',
  marginBottom: theme.spacing(4),
  position: 'relative',
}));

// container for the slider with relative positioning for the year label
const SliderWrapper = styled(Box)({
  position: 'relative',
  paddingBottom: '15px', // space for the year label below
});

// styled component for the year label positioned below the thumb
const YearLabel = styled(Typography)(({ position }) => ({
  position: 'absolute',
  bottom: '-5px',
  left: `calc(${position}% - 20px)`, // center the label under the thumb
  fontWeight: 'bold',
  fontSize: '1.1rem',
  color: '#fff',
  pointerEvents: 'none',
  minWidth: '40px',
  textAlign: 'center',
}));

// grid container for research tiles
const TilesGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: theme.spacing(3),
  marginTop: theme.spacing(4),
}));

// styled research tile card with glassy effect
const ResearchTile = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  background: 'rgba(19, 55, 85, 0.3)',
  backdropFilter: 'blur(25px) saturate(180%)',
  WebkitBackdropFilter: 'blur(25px) saturate(180%)',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  borderRadius: '20px',
  transition: 'all 0.3s ease-in-out',
  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 48px rgba(19, 55, 85, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
    background: 'rgba(19, 55, 85, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.25)',
  },
}));

// Export a reusable ResearchTile component for preview
export function ResearchTileCard({ title, impact, money, summary }) {
  return (
    <ResearchTile>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {impact}
        </Typography>
        <Typography variant="h6" color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>
          {money}
        </Typography>
        {summary && (
          <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
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

  // dummy data for research tiles - returns 2-3 tiles per year
  const getResearchTiles = (year) => {
    const tileCount = 2 + (year % 2); // 2 or 3 tiles
    const dummyTiles = Array.from({ length: tileCount }, (_, index) => ({
      id: `${year}-${index + 1}`,
      title: `Research Project ${index + 1}`,
      impact: `Impact description for ${year}`,
      money: `$${(Math.random() * 500000 + 100000).toFixed(0)}`,
      summary: `This research project conducted in ${year} has made significant contributions to the field. The project focused on advancing our understanding of key research areas and has resulted in measurable improvements. Through dedicated funding and collaborative efforts, we were able to achieve breakthrough results that will benefit the community for years to come.`,
    }));
    
    // Get approved tiles from localStorage
    const approvedTiles = JSON.parse(localStorage.getItem('approvedResearchTiles') || '[]');
    const approvedForYear = approvedTiles
      .filter(tile => tile.year === year)
      .map(tile => ({
        id: tile.id,
        title: tile.title,
        impact: tile.impact,
        money: tile.money,
        summary: tile.summary,
      }));
    
    // Combine approved tiles with dummy tiles
    return [...approvedForYear, ...dummyTiles];
  };

  const researchTiles = getResearchTiles(currentYear);
  const selectedTile = researchTiles.find(tile => tile.id === openTileId);

  return (
    <Container>
      <Typography 
        variant="h4" 
        component="h2" 
        gutterBottom 
        sx={{ 
          mb: 4, 
          fontWeight: 'bold', 
          textAlign: 'center',
          color: '#fff',
          textShadow: '0 0 20px rgba(19, 55, 85, 0.5)',
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
              color: '#FFEAA7', // butter yellow
              '& .MuiSlider-thumb': {
                backgroundColor: '#FFEAA7',
                border: '2px solid rgba(255, 234, 167, 0.8)',
                boxShadow: '0 0 10px rgba(255, 234, 167, 0.5)',
                '&:hover': {
                  boxShadow: '0 0 15px rgba(255, 234, 167, 0.7)',
                },
              },
              '& .MuiSlider-track': {
                backgroundColor: '#FFEAA7',
                border: 'none',
              },
              '& .MuiSlider-rail': {
                backgroundColor: 'rgba(255, 234, 167, 0.3)',
              },
            }}
          />
          <YearLabel position={position}>
            {currentYear}
          </YearLabel>
        </SliderWrapper>
      </SliderContainer>

      <TilesGrid>
        {researchTiles.map((tile) => (
          <ResearchTile key={tile.id}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold', color: '#fff' }}>
                {tile.title}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.7)' }}>
                {tile.impact}
              </Typography>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#64b5f6', textShadow: '0 0 10px rgba(100, 181, 246, 0.5)' }}>
                {tile.money}
              </Typography>
              <Button 
                variant="outlined" 
                size="small" 
                fullWidth
                onClick={() => handleOpenPopup(tile.id)}
                sx={{
                  background: 'rgba(19, 55, 85, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  '&:hover': {
                    background: 'rgba(19, 55, 85, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 4px 16px rgba(19, 55, 85, 0.5)',
                  }
                }}
              >
                View More
              </Button>
            </CardContent>
          </ResearchTile>
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
            background: 'rgba(19, 55, 85, 0.5)',
            backdropFilter: 'blur(40px) saturate(180%)',
            WebkitBackdropFilter: 'blur(40px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '24px',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
          }
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff' }}>
          {selectedTile?.title}
          <IconButton
            aria-label="close"
            onClick={handleClosePopup}
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              '&:hover': {
                color: '#fff',
                background: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ color: '#fff', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          <Typography variant="body1" paragraph sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            {selectedTile?.summary}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }} gutterBottom>
              Funding Amount:
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#64b5f6', textShadow: '0 0 10px rgba(100, 181, 246, 0.5)' }}>
              {selectedTile?.money}
            </Typography>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }} gutterBottom>
              Impact:
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              {selectedTile?.impact}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Button 
            onClick={handleClosePopup}
            sx={{
              background: 'rgba(19, 55, 85, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#fff',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              borderRadius: '20px',
              '&:hover': {
                background: 'rgba(19, 55, 85, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 4px 16px rgba(19, 55, 85, 0.5)',
              }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
