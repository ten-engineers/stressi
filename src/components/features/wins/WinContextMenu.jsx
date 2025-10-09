import { Menu, MenuItem, ListItemIcon, CircularProgress } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';

const WinContextMenu = ({ 
  contextMenu, 
  selectedWin, 
  onClose, 
  onCopy, 
  onEdit,
  onDelete,
  onCreateImage,
  isGeneratingImage
}) => {
  const handleCopy = () => {
    if (selectedWin) {
      navigator.clipboard.writeText(selectedWin.text);
      onClose();
    }
  };

  const handleEdit = () => {
    if (selectedWin) {
      onEdit(selectedWin);
      onClose();
    }
  };

  const handleDelete = () => {
    if (selectedWin) {
      onDelete(selectedWin.id);
      onClose();
    }
  };

  const handleCreateImage = async () => {
    if (selectedWin) {
      await onCreateImage(selectedWin);
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
      <MenuItem onClick={handleEdit} disableRipple>
        <ListItemIcon>
          <EditIcon fontSize="small" />
        </ListItemIcon>
        Edit
      </MenuItem>
      <MenuItem onClick={handleCreateImage} disableRipple disabled={isGeneratingImage}>
        <ListItemIcon>
          {isGeneratingImage ? (
            <CircularProgress size={20} />
          ) : (
            <ImageIcon fontSize="small" />
          )}
        </ListItemIcon>
        Create an image
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

