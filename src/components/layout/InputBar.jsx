import { Box, TextField, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const InputBar = ({ 
  text, 
  error, 
  darkMode, 
  keyboardHeight, 
  onChange, 
  onKeyDown, 
  onSubmit 
}) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: keyboardHeight > 0 ? `${keyboardHeight}px` : 0,
        left: 0,
        right: 0,
        display: 'flex',
        alignItems: 'center',
        bgcolor: darkMode
          ? 'background.default'
          : 'background.default',
        padding: '10px 1rem',
        borderTop: '1px solid',
        borderColor: 'divider',
        zIndex: 1000,
        transition: 'bottom 0.2s ease-in-out',
      }}
    >
      <TextField
        value={text}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder="Enter your win here..."
        variant="outlined"
        error={error}
        fullWidth
        sx={{
          flex: 1,
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              border: 'none',
            },
          },
        }}
      />
      <Button
        onClick={onSubmit}
        variant="text"
        color="primary"
        sx={{
          height: '56px',
          marginLeft: 1,
          minWidth: '56px',
          padding: '0 16px',
        }}
      >
        <SendIcon />
      </Button>
    </Box>
  );
};

export default InputBar;

