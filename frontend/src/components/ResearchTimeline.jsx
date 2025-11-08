import React, { useState } from 'react';
import { Slider, Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

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

export default function ResearchTimeline() {
  // track which year the user has selected, starting at 2012
  const [selectedYear, setSelectedYear] = useState(2012);

  // update the selected year when user moves the slider
  const handleSliderChange = (event, newValue) => {
    setSelectedYear(newValue);
  };

  // calculate the position percentage for the year label
  const min = 2012;
  const max = 2025;
  const position = ((selectedYear - min) / (max - min)) * 100;

  return (
    <Container>
      <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4, fontWeight: 'bold', textAlign: 'center' }}>
        View Donor Impact
      </Typography>

      <SliderContainer>
        <SliderWrapper>
          <Slider
            value={selectedYear}
            onChange={handleSliderChange}
            min={2012}
            max={2025}
            step={1}
            valueLabelDisplay="off"
          />
          <YearLabel position={position}>
            {selectedYear}
          </YearLabel>
        </SliderWrapper>
      </SliderContainer>
    </Container>
  );
}
