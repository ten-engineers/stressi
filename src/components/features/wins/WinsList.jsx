import { Box, List, Paper, ListSubheader } from '@mui/material';
import { formatDateShort } from '../../../utils';
import WinItem from './WinItem';

const WinsList = ({ 
  groupedWins, 
  darkMode, 
  onContextMenu, 
  onDateClick,
  setCurrentDate,
  setIsCalendarOpen 
}) => {
  const handleDateClick = (date) => {
    setIsCalendarOpen(true);
    const clickedDate = new Date(date);
    setCurrentDate(clickedDate);
  };

  return (
    <Box>
      {Object.keys(groupedWins).length > 0 && (
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <h3>Your wins:</h3>
        </Box>
      )}
      {Object.keys(groupedWins).length > 0 ? (
        <List sx={{ pb: '76px' }}>
          {Object.entries(groupedWins).map(([date, wins]) => (
            <Paper
              key={date}
              sx={{
                mb: 2,
                p: 2,
                boxShadow: darkMode ? undefined : 'none',
                bgcolor: darkMode ? undefined : 'rgba(0, 0, 0, 0.02)',
              }}
              data-date={date}
            >
              {wins.map((win, index) => (
                <WinItem
                  key={win.id || index}
                  win={win}
                  onContextMenu={onContextMenu}
                />
              ))}
              <ListSubheader
                sx={{
                  background: 'transparent',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '4px',
                  marginLeft: 'auto',
                  width: 'fit-content',
                  lineHeight: 1,
                  px: 0.5,
                  py: 0.5,
                }}
                onClick={() => handleDateClick(date)}
              >
                {formatDateShort(date)}
              </ListSubheader>
            </Paper>
          ))}
        </List>
      ) : (
        <h3>Add your first win</h3>
      )}
    </Box>
  );
};

export default WinsList;

