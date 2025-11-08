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
  backgroundColor: '#fafafa',
  borderRadius: theme.shape.borderRadius * 2,
  marginBottom: theme.spacing(4),
}));

export default function ResearchTimeline() {
  // track which year the user has selected, starting at 2012
  const [selectedYear, setSelectedYear] = useState(2012);

  // update the selected year when user moves the slider
  const handleSliderChange = (event, newValue) => {
    setSelectedYear(newValue);
  };

  return (
    <Container>
      <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        View Donor Impact
      </Typography>

      <SliderContainer>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Select a year:
        </Typography>
        {/* i need to change this: basic slider for selecting years between 2012 and 2025 */}
        <Slider
          value={selectedYear}
          onChange={handleSliderChange}
          min={2012}
          max={2025}
          step={1}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => value}
        />
      </SliderContainer>
    </Container>
  );
}
