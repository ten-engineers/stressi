import { Button } from '@mui/material';

const InstallButton = ({ isInstallable, onInstall }) => {
  if (!isInstallable) return null;

  return (
    <Button
      variant="outlined"
      color="secondary"
      onClick={onInstall}
      sx={{ marginTop: '50px', marginBottom: 2 }}
    >
      Install App
    </Button>
  );
};

export default InstallButton;

