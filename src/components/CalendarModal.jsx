import { useState, useEffect, useRef, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Grid,
  AppBar,
  Toolbar,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  subMonths,
  eachMonthOfInterval,
  subYears,
} from "date-fns";

const MonthGrid = ({ month, wins, initialDate, onDateSelect }) => {
  // Memoize expensive calculations
  const monthData = useMemo(() => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    // Calculate empty cells at the start of the month
    const firstDayOfMonth = monthStart.getDay(); // 0 for Sunday, 1 for Monday, etc.
    const emptyStartCells = Array(firstDayOfMonth).fill(null);
    
    const datesWithWins = wins.map((win) => new Date(win.date));
    
    return { days, emptyStartCells, datesWithWins };
  }, [month, wins]);

  const { days, emptyStartCells, datesWithWins } = monthData;

  const getWinsForDate = (date) => {
    return wins.filter((win) => isSameDay(new Date(win.date), date));
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h6"
        align="center"
        sx={{
          mb: 2,
          fontWeight: "normal",
        }}
      >
        {format(month, "MMMM yyyy")}
      </Typography>
      <Grid
        container
        columns={7}
        spacing={1}
        sx={{
          width: "100%",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        {emptyStartCells.map((_, index) => (
          <Grid item xs={1} key={`empty-start-${index}`} sx={{ p: "4px" }}>
            <Box sx={{ aspectRatio: "1" }} />
          </Grid>
        ))}

        {days.map((day, index) => {
          const hasWins = datesWithWins.some((date) => isSameDay(date, day));
          const winsForDay = getWinsForDate(day);
          const isSelected = initialDate && isSameDay(day, initialDate);

          return (
            <Grid item xs={1} key={index} sx={{ p: "4px" }}>
              <Box
                sx={{
                  aspectRatio: "1",
                  border: "1px solid",
                  borderColor: isSelected ? "primary.main" : "transparent",
                  bgcolor: hasWins ? "primary.light" : "transparent",
                  color: hasWins ? "primary.contrastText" : "text.primary",
                  cursor: hasWins ? "pointer" : "default",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  minHeight: 45,
                  "&:hover": {
                    bgcolor: hasWins ? "primary.main" : "transparent",
                  },
                }}
                onClick={() => {
                  if (hasWins && onDateSelect) {
                    onDateSelect(day);
                  }
                }}
                data-date={format(day, "yyyy-MM-dd")}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: isSelected ? "bold" : "normal",
                    fontSize: "0.9rem",
                    lineHeight: 1,
                  }}
                >
                  {format(day, "d")}
                </Typography>
                {hasWins && (
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: "0.7rem",
                      lineHeight: 1,
                      mt: 0.5,
                    }}
                  >
                    {winsForDay.length}
                  </Typography>
                )}
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

const CalendarModal = ({ open, onClose, wins, initialDate, onDateSelect }) => {
  // Memoize expensive date calculations - only run when modal opens
  const months = useMemo(() => {
    if (!open) return []; // Don't calculate when modal is closed
    
    const endDate = new Date();
    const startDate = subMonths(endDate, 73); // Go back exactly 73 months
    
    return eachMonthOfInterval({
      start: startDate,
      end: endDate,
    }); // Older months first, current month last
  }, [open]); // Only recalculate when modal opens/closes

  // Create ref for the dialog content
  const dialogContentRef = useRef(null);

  // Scroll to bottom when modal opens
  useEffect(() => {
    if (open && dialogContentRef.current) {
      // Force scroll to bottom after a small delay to ensure content is rendered
      const scrollToBottom = () => {
        const element = dialogContentRef.current;
        if (element) {
          element.scrollTop = element.scrollHeight;
        }
      };

      // Initial scroll
      scrollToBottom();

      // Backup scroll after a small delay
      const timeoutId = setTimeout(scrollToBottom, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [open]);

  const handleDateSelect = (selectedDate) => {
    // Pass the selected date to the parent component
    if (onDateSelect) {
      onDateSelect(selectedDate);
    }
    // Close the modal
    onClose();
  };


  return (
    <Dialog
      keepMounted
      open={open}
      onClose={onClose}
      fullScreen
      PaperProps={{
        sx: {
          bgcolor: "background.default",
          height: "100%",
        },
      }}
      TransitionProps={{
        onEntered: () => {
          // Additional scroll after transition is complete
          if (dialogContentRef.current) {
            dialogContentRef.current.scrollTop =
              dialogContentRef.current.scrollHeight;
          }
        },
      }}
    >
      <AppBar
        position="sticky"
        color="default"
        elevation={0}
        sx={{ borderBottom: "1px solid", borderColor: "divider" }}
      >
        <Toolbar>
          <IconButton edge="start" onClick={onClose} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">Calendar</Typography>
        </Toolbar>
      </AppBar>

      <DialogContent
        ref={dialogContentRef}
        sx={{
          height: "calc(100% - 64px)", // Subtract AppBar height
          overflowY: "auto",
        }}
      >
        <Box
          sx={{
            maxWidth: "600px",
            margin: "0 auto",
            pt: 2,
            pb: 2,
          }}
        >
          {months.map((month, index) => (
            <Box key={index}>
              <MonthGrid
                month={month}
                wins={wins}
                initialDate={initialDate}
                onDateSelect={handleDateSelect}
              />
            </Box>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarModal;
