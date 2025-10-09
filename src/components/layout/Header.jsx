import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import ThemeSwitcher from '../common/ThemeSwitcher';
import { APP_NAME } from '../../constants';

const Header = ({ darkMode, setDarkMode }) => {
  return (
    <AppBar
      position="fixed"
      color="default"
      elevation={0}
      sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ width: '100px' }} />
        <Typography variant="h6" component="div">
          {APP_NAME}
        </Typography>
        <Box sx={{ width: '100px', display: 'flex', justifyContent: 'flex-end' }}>
          <ThemeSwitcher darkMode={darkMode} setDarkMode={setDarkMode} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

