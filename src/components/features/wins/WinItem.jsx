import { Box, ListItem, ListItemText } from '@mui/material';
import { useWinImage } from '../../../hooks';

const WinItem = ({ win, onContextMenu }) => {
  const imageUrl = useWinImage(win.id, win.hasImage, win.imageVersion);

  return (
    <ListItem
      onContextMenu={(event) => onContextMenu(event, win)}
      onClick={(event) => {
        if (window.innerWidth <= 600) {
          event.preventDefault();
          onContextMenu(event, win);
        }
      }}
      sx={{ 
        cursor: 'pointer',
        flexDirection: 'column',
        alignItems: 'flex-start'
      }}
    >
      {imageUrl && (
        <Box 
          component="img" 
          src={imageUrl} 
          alt="Generated image"
          sx={{ 
            maxWidth: '100%',
            height: 'auto',
            mb: 1,
            borderRadius: '8px'
          }}
        />
      )}
      <ListItemText primary={`• ${win.text}`} />
    </ListItem>
  );
};

export default WinItem;

