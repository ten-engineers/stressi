import { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField,
  Typography,
  Box,
  Link
} from '@mui/material';

const SettingsDialog = ({ open, onClose, apiKey, onSaveApiKey }) => {
  const [localApiKey, setLocalApiKey] = useState(apiKey);

  const handleSave = () => {
    onSaveApiKey(localApiKey);
    onClose();
  };

  const handleClear = () => {
    setLocalApiKey('');
    onSaveApiKey('');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1 }}>
          <Typography variant="h6" gutterBottom>
            OpenAI API Key
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            To use the AI image generation feature, you need to provide your own OpenAI API key.
            Your key is stored locally in your browser and never sent to any server except OpenAI.
          </Typography>
          <TextField
            fullWidth
            label="OpenAI API Key"
            type="password"
            value={localApiKey}
            onChange={(e) => setLocalApiKey(e.target.value)}
            placeholder="sk-..."
            margin="normal"
            helperText="Get your API key from OpenAI Platform"
          />
          <Link 
            href="https://platform.openai.com/api-keys" 
            target="_blank" 
            rel="noopener noreferrer"
            sx={{ display: 'block', mt: 1, mb: 2 }}
          >
            Get API Key from OpenAI →
          </Link>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClear} color="error">
          Clear Key
        </Button>
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsDialog;

