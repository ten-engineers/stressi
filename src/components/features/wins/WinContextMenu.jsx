import { Menu, MenuItem, ListItemIcon } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';

const WinContextMenu = ({ 
  contextMenu, 
  selectedWin, 
  onClose, 
  onCopy, 
  onDelete 
}) => {
  const handleCopy = () => {
    if (selectedWin) {
      navigator.clipboard.writeText(selectedWin.text);
      onClose();
    }
  };

  const handleDelete = () => {
    if (selectedWin) {
      onDelete(selectedWin.id);
      onClose();
    }
  };

  return (
    <Menu
      open={contextMenu !== null}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={
        contextMenu !== null
          ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
          : undefined
      }
      disableAutoFocus
      disableEnforceFocus
      disableRestoreFocus
      disablePortal
      slotProps={{
        paper: {
          'aria-hidden': false,
          'role': 'menu'
        },
        root: {
          'aria-hidden': false
        }
      }}
    >
      <MenuItem onClick={handleCopy} disableRipple>
        <ListItemIcon>
          <ContentCopyIcon fontSize="small" />
        </ListItemIcon>
        Copy
      </MenuItem>
      <MenuItem onClick={handleDelete} disableRipple>
        <ListItemIcon>
          <DeleteIcon fontSize="small" />
        </ListItemIcon>
        Delete
      </MenuItem>
    </Menu>
  );
};

export default WinContextMenu;

