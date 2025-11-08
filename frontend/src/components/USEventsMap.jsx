import { useMemo, useState } from 'react';
import { Box, Select, MenuItem, FormControl, InputLabel, Typography } from '@mui/material';
import eventsData from '../data/events.json';

// Using a simple, accurate approach: embed a US map image and overlay interactive regions
// This avoids dependency issues while providing a proper map appearance

export default function USEventsMap({ events: eventsProp }) {
  const allEvents = eventsProp || eventsData;
  
  // Initialize selectedYear with first available year
  const getInitialYear = () => {
    const years = [...new Set(allEvents.map(e => new Date(e.date).getFullYear()))].sort((a, b) => b - a);
    return years.length > 0 ? years[0].toString() : '';
  };
  
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState(getInitialYear);
  const [hoveredState, setHoveredState] = useState(null);

  // Parse events and extract unique months/years
  const { filteredEvents, availableMonths, availableYears } = useMemo(() => {
    const parsed = allEvents.map(event => {
      const date = new Date(event.date);
      return {
        ...event,
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        monthName: date.toLocaleString('default', { month: 'long' }),
      };
    });

    // Get unique months and years from data
    const months = [...new Set(parsed.map(e => e.month))].sort((a, b) => a - b);
    const years = [...new Set(parsed.map(e => e.year))].sort((a, b) => b - a);

    // Filter by selected month and year
    let filtered = parsed;
    if (selectedYear) {
      filtered = filtered.filter(e => e.year === parseInt(selectedYear));
    }
    if (selectedMonth) {
      filtered = filtered.filter(e => e.month === parseInt(selectedMonth));
    }

    return {
      filteredEvents: filtered,
      availableMonths: months,
      availableYears: years,
    };
  }, [allEvents, selectedMonth, selectedYear]);

  // Group events by state
  const eventsByState = useMemo(() => {
    const grouped = {};
    filteredEvents.forEach(event => {
      if (!grouped[event.state]) {
        grouped[event.state] = [];
      }
      grouped[event.state].push(event);
    });
    return grouped;
  }, [filteredEvents]);

  // Get state fill color based on event count
  const getStateFill = (stateCode) => {
    const count = eventsByState[stateCode]?.length || 0;
    if (count === 0) return 'transparent';
    if (count === 1) return '#e3f2fd';
    if (count === 2) return '#bbdefb';
    return '#90caf9';
  };

  const getStateOpacity = (stateCode) => {
    const count = eventsByState[stateCode]?.length || 0;
    return count > 0 ? 0.6 : 0;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // State name mapping
  const stateNames = {
    AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
    CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
    HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
    KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
    MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri',
    MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey',
    NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio',
    OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina',
    SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont',
    VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
    DC: 'District of Columbia'
  };

  // Accurate state center coordinates for 959x593 viewBox (Albers projection)
  // Coordinates calibrated to match Wikipedia US map with state names
  // Adjusted for states with events to match actual geographic centers
  const stateCenters = {
    AL: { x: 720, y: 445 },      // Alabama - southeast
    AK: { x: 150, y: 420 },      // Alaska - northwest inset (lower left)
    AZ: { x: 300, y: 405 },      // Arizona - southwest
    AR: { x: 620, y: 425 },      // Arkansas - central south
    CA: { x: 60, y: 276 },      // California - west coast (adjusted for LA area)
    CO: { x: 480, y: 345 },      // Colorado - central west
    CT: { x: 870, y: 295 },      // Connecticut - northeast
    DE: { x: 850, y: 318 },      // Delaware - mid-atlantic
    FL: { x: 780, y: 535 },      // Florida - southeast peninsula (adjusted for Miami)
    GA: { x: 750, y: 440 },      // Georgia - southeast (adjusted for Atlanta)
    HI: { x: 280, y: 515 },      // Hawaii - pacific inset (lower left)
    ID: { x: 320, y: 265 },      // Idaho - northwest
    IL: { x: 635, y: 350 },      // Illinois - midwest (adjusted for Chicago in north)
    IN: { x: 690, y: 345 },      // Indiana - midwest
    IA: { x: 575, y: 310 },      // Iowa - central
    KS: { x: 540, y: 380 },      // Kansas - central
    KY: { x: 710, y: 380 },      // Kentucky - central east
    LA: { x: 630, y: 475 },      // Louisiana - gulf coast
    ME: { x: 885, y: 195 },      // Maine - northeast
    MD: { x: 775, y: 275 },      // Maryland - mid-atlantic (adjusted for Baltimore)
    MA: { x: 875, y: 280 },      // Massachusetts - northeast (adjusted for Boston)
    MI: { x: 690, y: 280 },      // Michigan - great lakes
    MN: { x: 570, y: 235 },      // Minnesota - upper midwest
    MS: { x: 670, y: 455 },      // Mississippi - south central
    MO: { x: 590, y: 370 },      // Missouri - central
    MT: { x: 415, y: 225 },      // Montana - northwest
    NE: { x: 520, y: 325 },      // Nebraska - central
    NV: { x: 240, y: 335 },      // Nevada - west
    NH: { x: 870, y: 260 },      // New Hampshire - northeast
    NJ: { x: 850, y: 310 },      // New Jersey - mid-atlantic
    NM: { x: 425, y: 425 },      // New Mexico - southwest
    NY: { x: 820, y: 280 },      // New York - northeast (adjusted for NYC/Albany)
    NC: { x: 795, y: 405 },      // North Carolina - southeast (adjusted for Charlotte)
    ND: { x: 490, y: 205 },      // North Dakota - upper midwest
    OH: { x: 725, y: 340 },      // Ohio - midwest
    OK: { x: 560, y: 420 },      // Oklahoma - south central
    OR: { x: 200, y: 245 },      // Oregon - northwest
    PA: { x: 800, y: 320 },      // Pennsylvania - mid-atlantic (adjusted for Philadelphia)
    RI: { x: 870, y: 290 },      // Rhode Island - northeast
    SC: { x: 790, y: 435 },      // South Carolina - southeast
    SD: { x: 505, y: 280 },      // South Dakota - central
    TN: { x: 700, y: 415 },      // Tennessee - southeast
    TX: { x: 425, y: 485 },      // Texas - south central (adjusted for Houston in southeast)
    UT: { x: 345, y: 355 },      // Utah - west
    VT: { x: 860, y: 250 },      // Vermont - northeast
    VA: { x: 805, y: 360 },      // Virginia - mid-atlantic
    WA: { x: 230, y: 195 },      // Washington - northwest (adjusted for Seattle)
    WV: { x: 760, y: 355 },      // West Virginia - mid-atlantic
    WI: { x: 615, y: 270 },      // Wisconsin - upper midwest
    WY: { x: 435, y: 315 },      // Wyoming - west
    DC: { x: 835, y: 332 }       // District of Columbia - mid-atlantic (between MD and VA)
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Title */}
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          color: '#000000',
          mb: 2
        }}
      >
        Events Map
      </Typography>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="year-select-label">Year</InputLabel>
          <Select
            labelId="year-select-label"
            value={selectedYear}
            label="Year"
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <MenuItem value="">
              <em>All Years</em>
            </MenuItem>
            {availableYears.map(year => (
              <MenuItem key={year} value={year.toString()}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel id="month-select-label">Month</InputLabel>
          <Select
            labelId="month-select-label"
            value={selectedMonth}
            label="Month"
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <MenuItem value="">
              <em>All Months</em>
            </MenuItem>
            {availableMonths.map(month => (
              <MenuItem key={month} value={month.toString()}>
                {monthNames[month - 1]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Map Container */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '360px',
          backgroundColor: '#fafafa',
          borderRadius: 1,
          border: '1px solid #e0e0e0',
          overflow: 'hidden',
        }}
        role="img"
        aria-label="United States events map"
      >
        {/* Background: US Map Image from CDN */}
        <Box
          component="img"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Map_of_USA_with_state_names.svg/959px-Map_of_USA_with_state_names.svg.png"
          alt="United States Map"
          onError={(e) => {
            // Fallback if image fails to load
            e.target.style.display = 'none';
          }}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            opacity: 0.4,
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
        
        {/* Interactive overlay SVG - must match the image dimensions exactly */}
        <svg
          viewBox="0 0 959 593"
          preserveAspectRatio="xMidYMid meet"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
          }}
        >
          {/* Render interactive regions for states with events */}
          {Object.entries(stateCenters).map(([code, center]) => {
            const events = eventsByState[code] || [];
            const isHovered = hoveredState === code;
            const fillColor = getStateFill(code);
            const opacity = isHovered ? 0.85 : (events.length > 0 ? 0.7 : 0);
            const eventCount = events.length;
            
            if (eventCount === 0 && !isHovered) return null;
            
            return (
              <g key={code}>
                {/* Highlight circle for states with events */}
                <circle
                  cx={center.x}
                  cy={center.y}
                  r={isHovered ? 22 : (eventCount > 0 ? 18 : 0)}
                  fill={isHovered ? '#1E88E5' : fillColor}
                  stroke={isHovered ? '#1565C0' : '#1976d2'}
                  strokeWidth={isHovered ? 2.5 : 2}
                  opacity={opacity}
                  style={{
                    cursor: eventCount > 0 ? 'pointer' : 'default',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={() => setHoveredState(code)}
                  onMouseLeave={() => setHoveredState(null)}
                  aria-label={`${stateNames[code]}: ${eventCount} event${eventCount !== 1 ? 's' : ''}`}
                >
                  <title>
                    {stateNames[code]}: {eventCount} event{eventCount !== 1 ? 's' : ''}
                    {events.length > 0 && events.map(e => `\n- ${e.name} (${e.city})`).join('')}
                  </title>
                </circle>
                
                {/* Event count label with better visibility */}
                {eventCount > 0 && (
                  <text
                    x={center.x}
                    y={center.y + 4}
                    fill={isHovered ? '#ffffff' : '#1565C0'}
                    fontSize="11"
                    fontWeight="bold"
                    textAnchor="middle"
                    style={{ 
                      pointerEvents: 'none', 
                      userSelect: 'none',
                      textShadow: isHovered ? '0 1px 2px rgba(0,0,0,0.3)' : 'none'
                    }}
                  >
                    {eventCount}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Tooltip for hovered state */}
        {hoveredState && eventsByState[hoveredState] && (
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'white',
              padding: 1.5,
              borderRadius: 1,
              boxShadow: 2,
              border: '1px solid #e0e0e0',
              maxWidth: '200px',
              zIndex: 10,
            }}
            role="tooltip"
          >
            <Typography variant="subtitle2" fontWeight="bold">
              {stateNames[hoveredState] || hoveredState}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {eventsByState[hoveredState].length} event{eventsByState[hoveredState].length !== 1 ? 's' : ''}
            </Typography>
            {eventsByState[hoveredState].slice(0, 3).map(event => (
              <Typography key={event.id} variant="caption" display="block" sx={{ mt: 0.5 }}>
                • {event.name}
              </Typography>
            ))}
            {eventsByState[hoveredState].length > 3 && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                +{eventsByState[hoveredState].length - 3} more
              </Typography>
            )}
          </Box>
        )}
      </Box>

      {/* Legend */}
      <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          Event count:
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 16, height: 12, bgcolor: '#f5f5f5', border: '1px solid #d0d0d0', borderRadius: 0.5 }} />
            <Typography variant="caption">0</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 16, height: 12, bgcolor: '#e3f2fd', borderRadius: 0.5 }} />
            <Typography variant="caption">1</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 16, height: 12, bgcolor: '#bbdefb', borderRadius: 0.5 }} />
            <Typography variant="caption">2</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 16, height: 12, bgcolor: '#90caf9', borderRadius: 0.5 }} />
            <Typography variant="caption">3+</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
