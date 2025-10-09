import { Box, TextField, Button, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';

const InputBar = ({ 
  text, 
  error, 
  darkMode, 
  onChange, 
  onKeyDown, 
  onSubmit,
  isEditing = false,
  onCancelEdit 
}) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
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
        zIndex: 1300,
      }}
    >
      <TextField
        value={text}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={isEditing ? "Edit your win..." : "Enter your win..."}
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
      {isEditing && (
        <IconButton
          onClick={onCancelEdit}
          color="default"
          sx={{
            height: '56px',
            width: '56px',
            marginLeft: 0.5,
          }}
          aria-label="Cancel edit"
        >
          <CloseIcon />
        </IconButton>
      )}
      <Button
        onClick={onSubmit}
        variant="text"
        color="primary"
        sx={{
          height: '56px',
          marginLeft: 1,
          minWidth: '56px',
          padding: '0 16px',
          outline: 'none',
          '&:focus': {
            outline: 'none',
          },
        }}
      >
        <SendIcon />
      </Button>
    </Box>
  );
};

export default InputBar;

