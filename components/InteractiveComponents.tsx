"use client"
import { useState } from "react"
import {
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  Switch,
  Slider,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
} from "@mui/material"
import toast from "react-hot-toast"

const InteractiveComponents = () => {
  const [textValue, setTextValue] = useState("")
  const [selectValue, setSelectValue] = useState("")
  const [checkboxValue, setCheckboxValue] = useState(false)
  const [radioValue, setRadioValue] = useState("")
  const [switchValue, setSwitchValue] = useState(false)
  const [sliderValue, setSliderValue] = useState(30)
  const [dialogOpen, setDialogOpen] = useState(false)

  // New state for enhanced components
  const [alertText, setAlertText] = useState("")
  const [confirmText, setConfirmText] = useState("")
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [confirmResult, setConfirmResult] = useState("")

  const [hoverText, setHoverText] = useState("Hover over me!")
  const [mouseEventLog, setMouseEventLog] = useState<string[]>([])

  const [isElementVisible, setIsElementVisible] = useState(true)

  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)

  // Countries data for autocomplete
  const countries = [
    "Afghanistan",
    "Albania",
    "Algeria",
    "Argentina",
    "Australia",
    "Austria",
    "Bangladesh",
    "Belgium",
    "Brazil",
    "Bulgaria",
    "Canada",
    "Chile",
    "China",
    "Colombia",
    "Croatia",
    "Czech Republic",
    "Denmark",
    "Egypt",
    "Finland",
    "France",
    "Germany",
    "Greece",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Ireland",
    "Israel",
    "Italy",
    "Japan",
    "Jordan",
    "Kenya",
    "South Korea",
    "Latvia",
    "Lithuania",
    "Malaysia",
    "Mexico",
    "Netherlands",
    "New Zealand",
    "Norway",
    "Pakistan",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Romania",
    "Russia",
    "Saudi Arabia",
    "Singapore",
    "Slovakia",
    "Slovenia",
    "South Africa",
    "Spain",
    "Sweden",
    "Switzerland",
    "Thailand",
    "Turkey",
    "Ukraine",
    "United Kingdom",
    "United States",
    "Vietnam",
  ]

  const handleCustomAlert = () => {
    if (alertText.trim()) {
      toast(alertText, {
        icon: "⚠️",
        style: {
          background: "#ff9800",
          color: "#fff",
        },
      })
    }
  }

  const handleConfirmDialog = () => {
    if (confirmText.trim()) {
      setConfirmDialogOpen(true)
    }
  }

  const handleConfirmYes = () => {
    setConfirmResult(`Confirmed: "${confirmText}"`)
    setConfirmDialogOpen(false)
    toast.success(`Confirmed: "${confirmText}"`)
  }

  const handleConfirmNo = () => {
    setConfirmResult(`Cancelled: "${confirmText}"`)
    setConfirmDialogOpen(false)
    toast.error(`Cancelled: "${confirmText}"`)
  }

  const logMouseEvent = (event: string) => {
    setMouseEventLog((prev) => [...prev.slice(-4), `${new Date().toLocaleTimeString()}: ${event}`])
    toast(`Mouse Event: ${event}`, {
      icon: "🖱️",
      duration: 2000,
      style: {
        background: "#2196f3",
        color: "#fff",
      },
    })
  }

  const handleShowAlert = () => {
    toast.success("This is a test alert message!", {
      duration: 3000,
    })
  }

  const handleCountrySelect = (country: string | null) => {
    setSelectedCountry(country)
    if (country) {
      toast.success(`Selected: ${country}`, {
        icon: "🌍",
        duration: 2000,
      })
    }
  }

  const handleToggleVisibility = () => {
    setIsElementVisible(!isElementVisible)
    toast(isElementVisible ? "Element hidden!" : "Element shown!", {
      icon: isElementVisible ? "👁️‍🗨️" : "👁️",
      duration: 2000,
    })
  }

  return (
    <Grid container spacing={3}>
      {/* Original Form Controls */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Form Controls
          </Typography>

          <TextField
            fullWidth
            label="Text Input"
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            margin="normal"
            data-testid="text-input"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel id="select-option-label">Select Option</InputLabel>
            <Select
              labelId="select-option-label"
              id="select-option"
              value={selectValue}
              label="Select Option"
              onChange={(e) => setSelectValue(e.target.value)}
              data-testid="select-input"
            >
              <MenuItem value="">Clear</MenuItem>
              <MenuItem value="option1">Option 1</MenuItem>
              <MenuItem value="option2">Option 2</MenuItem>
              <MenuItem value="option3">Option 3</MenuItem>
            </Select>
          </FormControl>


          <FormControlLabel
            control={
              <Checkbox
                checked={checkboxValue}
                onChange={(e) => setCheckboxValue(e.target.checked)}
                data-testid="checkbox-input"
              />
            }
            label="Checkbox Option"
          />

          <RadioGroup value={radioValue} onChange={(e) => setRadioValue(e.target.value)}>
            <FormControlLabel value="radio1" control={<Radio />} label="Radio 1" />
            <FormControlLabel value="radio2" control={<Radio />} label="Radio 2" />
          </RadioGroup>
        </Paper>
      </Grid>

      {/* Interactive Elements */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Interactive Elements
          </Typography>

          <Box sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={switchValue}
                  onChange={(e) => setSwitchValue(e.target.checked)}
                  data-testid="switch-input"
                />
              }
              label="Toggle Switch"
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography gutterBottom>Slider Value: {sliderValue}</Typography>
            <Slider
              value={sliderValue}
              onChange={(e, value) => setSliderValue(value as number)}
              min={0}
              max={100}
              data-testid="slider-input"
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button variant="contained" onClick={handleShowAlert} data-testid="show-alert-button">
              Show Toast Alert
            </Button>

            <Button variant="outlined" onClick={() => setDialogOpen(true)} data-testid="open-dialog-button">
              Open Dialog
            </Button>
          </Box>
        </Paper>
      </Grid>

      {/* Custom Alert and Confirm Dialogs */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Custom Toast & Confirm Dialogs
          </Typography>

          <TextField
            fullWidth
            label="Toast Message"
            value={alertText}
            onChange={(e) => setAlertText(e.target.value)}
            margin="normal"
            data-testid="alert-text-input"
            placeholder="Enter text for toast notification"
          />

          <Button
            variant="contained"
            onClick={handleCustomAlert}
            disabled={!alertText.trim()}
            sx={{ mt: 1, mr: 2 }}
            data-testid="custom-alert-button"
          >
            Show Custom Toast
          </Button>

          <TextField
            fullWidth
            label="Confirm Message"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            margin="normal"
            data-testid="confirm-text-input"
            placeholder="Enter text for confirm dialog"
          />

          <Button
            variant="outlined"
            onClick={handleConfirmDialog}
            disabled={!confirmText.trim()}
            sx={{ mt: 1 }}
            data-testid="custom-confirm-button"
          >
            Show Confirm Dialog
          </Button>

          {confirmResult && (
            <Typography
              variant="body2"
              sx={{ mt: 2, p: 2, bgcolor: "grey.100", borderRadius: 1 }}
              data-testid="confirm-result"
            >
              {confirmResult}
            </Typography>
          )}
        </Paper>
      </Grid>

      {/* Mouse Events */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Mouse Events Testing
          </Typography>

          <Card
            sx={{
              p: 2,
              mb: 2,
              cursor: "pointer",
              transition: "all 0.3s",
              "&:hover": {
                backgroundColor: "primary.light",
                color: "white",
                transform: "scale(1.02)",
              },
            }}
            onMouseEnter={() => setHoverText("Mouse is hovering!")}
            onMouseLeave={() => setHoverText("Hover over me!")}
            data-testid="hover-element"
          >
            <Typography variant="body1" sx={{ textAlign: "center" }}>
              {hoverText}
            </Typography>
          </Card>

          <Box
            sx={{
              p: 2,
              border: "2px dashed #ccc",
              borderRadius: 1,
              textAlign: "center",
              mb: 2,
              userSelect: "none",
            }}
            onMouseDown={() => logMouseEvent("Mouse Down")}
            onMouseUp={() => logMouseEvent("Mouse Up")}
            onMouseEnter={() => logMouseEvent("Mouse Enter")}
            onMouseLeave={() => logMouseEvent("Mouse Leave")}
            onDoubleClick={() => logMouseEvent("Double Click")}
            onContextMenu={(e) => {
              e.preventDefault()
              logMouseEvent("Right Click")
            }}
            data-testid="mouse-events-area"
          >
            <Typography variant="body2">
              Mouse Events Area
              <Box component="br" />
              Try: hover, click, double-click, right-click
            </Typography>
          </Box>

          <Box sx={{ maxHeight: 120, overflow: "auto" }}>
            <Typography variant="subtitle2" gutterBottom>
              Mouse Event Log:
            </Typography>
            <List dense data-testid="mouse-event-log">
              {mouseEventLog.map((event, index) => (
                <ListItem key={index} sx={{ py: 0 }}>
                  <ListItemText primary={event} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Paper>
      </Grid>

      {/* Show/Hide Element */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Show/Hide Element
          </Typography>

          <Button
            variant="contained"
            onClick={handleToggleVisibility}
            sx={{ mb: 2 }}
            data-testid="toggle-visibility-button"
          >
            {isElementVisible ? "Hide Element" : "Show Element"}
          </Button>

          {isElementVisible && (
            <Card sx={{ p: 2, backgroundColor: "success.light" }} data-testid="toggleable-element">
              <CardContent>
                <Typography variant="h6" sx={{ color: "success.contrastText" }}>
                  🎉 This element can be hidden!
                </Typography>
                <Typography variant="body2" sx={{ color: "success.contrastText" }}>
                  Perfect for testing element visibility and presence in automation tests.
                </Typography>
              </CardContent>
            </Card>
          )}

          {!isElementVisible && (
            <Typography variant="body2" color="text.secondary" data-testid="element-hidden-message">
              Element is currently hidden. Click the button to show it.
            </Typography>
          )}
        </Paper>
      </Grid>

      {/* Country Search Field */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Country Search Field
          </Typography>

          <Autocomplete
            options={countries}
            value={selectedCountry}
            onChange={(event, newValue) => handleCountrySelect(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Countries"
                placeholder="Type to search countries..."
                data-testid="country-search-input"
              />
            )}
            renderOption={(props, option) => (
              <Box
                component="li"
                {...props}
                data-testid={`country-option-${option.toLowerCase().replace(/\s+/g, "-")}`}
                key={option}
              >
                {option}
              </Box>
            )}
            data-testid="country-autocomplete"
            sx={{ mb: 2 }}
          />

          {selectedCountry && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Selected Country:
              </Typography>
              <Chip
                label={selectedCountry}
                color="primary"
                onDelete={() => handleCountrySelect(null)}
                data-testid="selected-country-chip"
              />
            </Box>
          )}

          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            This autocomplete field is perfect for testing:
            <Box component="br" />• Search functionality
            <Box component="br" />• Dropdown interactions
            <Box component="br" />• Selection and deletion
            <Box component="br" />• Dynamic option filtering
          </Typography>
        </Paper>
      </Grid>

      {/* Dialogs */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Test Dialog</DialogTitle>
        <DialogContent>
          <Typography>This is a test dialog for practicing modal interactions in test automation.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} data-testid="dialog-close-button">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Custom Confirm Dialog */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)} data-testid="confirm-dialog">
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to proceed with:</Typography>
          <Typography variant="body1" sx={{ fontWeight: "bold", mt: 1 }}>
            "{confirmText}"
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmNo} data-testid="confirm-no-button">
            No
          </Button>
          <Button onClick={handleConfirmYes} variant="contained" data-testid="confirm-yes-button">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default InteractiveComponents
