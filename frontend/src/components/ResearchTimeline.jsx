import { Box, Button, Card, CardContent, Slider, Typography } from '@mui/material';
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
  paddingBottom: '25px', // space for the year label below
});

// styled component for the year label positioned below the thumb
const YearLabel = styled(Typography)(({ position }) => ({
  position: 'absolute',
  bottom: '-15px',
  left: `calc(${position}% - 20px)`, // center the label under the thumb
  fontWeight: 'bold',
  fontSize: '1.1rem',
  color: '#1976d2',
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

// styled research tile card
const ResearchTile = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[6],
  },
}));

export default function ResearchTimeline({ selectedYear, setSelectedYear }) {
  // use props if provided, otherwise use local state
  const [localYear, setLocalYear] = useState(2012);
  const currentYear = selectedYear !== undefined ? selectedYear : localYear;
  const updateYear = setSelectedYear || setLocalYear;

  // update the selected year when user moves the slider
  const handleSliderChange = (event, newValue) => {
    updateYear(newValue);
  };

  // calculate the position percentage for the year label
  const min = 2012;
  const max = 2025;
  const position = ((currentYear - min) / (max - min)) * 100;

  // dummy data for research tiles - returns 2-3 tiles per year
  const getResearchTiles = (year) => {
    const tileCount = 2 + (year % 2); // 2 or 3 tiles
    return Array.from({ length: tileCount }, (_, index) => ({
      id: `${year}-${index + 1}`,
      title: `Research Project ${index + 1}`,
      impact: `Impact description for ${year}`,
      money: `$${(Math.random() * 500000 + 100000).toFixed(0)}`,
    }));
  };

  const researchTiles = getResearchTiles(currentYear);

  return (
    <Container>
      <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4, fontWeight: 'bold', textAlign: 'center' }}>
        View Donor Impact
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
              <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                {tile.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {tile.impact}
              </Typography>
              <Typography variant="h6" color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>
                {tile.money}
              </Typography>
              <Button variant="outlined" size="small" fullWidth>
                View More
              </Button>
            </CardContent>
          </ResearchTile>
        ))}
      </TilesGrid>
    </Container>
  );
}
