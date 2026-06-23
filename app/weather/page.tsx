"use client"
import React, { useState } from "react"
import { Container, TextField, Button, Select, MenuItem, Switch, FormControlLabel, Typography, Paper, Divider, CircularProgress, Autocomplete } from "@mui/material"

export default function WeatherForecastPage() {
     type CityOption = { label: string; key: string }
     const [inputCity, setInputCity] = useState<string>("London")
     const [selectedCity, setSelectedCity] = useState<CityOption | null>(null)
     const [cityOptions, setCityOptions] = useState<CityOption[]>([])
     const [units, setUnits] = useState<"metric" | "imperial">("metric")
     const [showDetails, setShowDetails] = useState(true)
     const [loading, setLoading] = useState(false)
     const [weather, setWeather] = useState<any>(null)
     const [error, setError] = useState("")

     const fetchWeather = async () => {
          setLoading(true)
          setError("")
          try {
               // Use only the city name for the API call
               let cityName = inputCity
               if (selectedCity) {
                    cityName = selectedCity.label.split(",")[0].trim()
               }
               const res = await fetch(`/api/weather?city=${cityName}&units=${units}`)
               const data = await res.json()
               setWeather(data)
          } catch (e) {
               setError("Failed to fetch weather")
          }
          setLoading(false)
     }

     // Fetch city suggestions from GeoDB Cities API (or similar AI API)
     const fetchCitySuggestions = async (input: string) => {
          if (!input || input.length < 2) return;
          // Always use only the city name (first part before comma)
          const cityName = input.split(",")[0].trim();

          try {
               const res = await fetch(`https://api.apilayer.com/geo/city/name/${cityName}`, {
                    headers: {
                         'apikey': process.env.NEXT_PUBLIC_API_LAYER_KEY || ''
                    }
               })
               const data = await res.json()
               const options: CityOption[] = data?.map((city: any) => ({
                    label: `${city.name}${city.state_or_region ? ', ' + city.state_or_region : ''}, ${city.country.name}`,
                    key: city.geo_id.toString()
               })) || []
               setCityOptions(options)
          } catch {
               setCityOptions([])
          }
     }

     return (
          <Container maxWidth="sm" sx={{ py: 4 }}>
               <Typography variant="h2" align="center" sx={{ mb: 2, fontWeight: 700 }} data-testid="weather-header">
                    Weather Center
               </Typography>
               <Typography variant="subtitle1" align="center" sx={{ mb: 4, color: 'text.white' }} data-testid="weather-subheader">
                    Get the latest weather forecast for your city
               </Typography>
               <Paper sx={{ p: 3 }}>
                    <Typography variant="h4" gutterBottom data-testid="weather-title">Weather Forecast</Typography>
                    <Autocomplete
                         freeSolo
                         options={cityOptions}
                         getOptionLabel={(option: CityOption | string) => typeof option === 'string' ? option : option.label}
                         inputValue={inputCity}
                         value={selectedCity}
                         onInputChange={(_, value) => {
                              setInputCity(value);
                              fetchCitySuggestions(value);
                         }}
                         onChange={(_, value) => {
                              if (typeof value === 'string') {
                                   setSelectedCity({ label: value, key: value })
                                   setInputCity(value)
                              } else {
                                   setSelectedCity(value)
                                   setInputCity(value?.label || "")
                              }
                         }}
                         renderOption={(props, option) => (
                              <li {...props} key={option.key}>
                                   {option.label}
                              </li>
                         )}
                         renderInput={(params) => (
                              <TextField
                                   {...params}
                                   label="Select City"
                                   placeholder="Type to search cities..."
                                   fullWidth
                                   sx={{ mb: 2 }}
                              />
                         )}
                         noOptionsText="No matching cities"
                    />
                    <Select
                         value={units}
                         onChange={e => setUnits(e.target.value as "metric" | "imperial")}
                         fullWidth
                         sx={{ mb: 2 }}
                         inputProps={{ "data-testid": "units-select" }}
                    >
                         <MenuItem value="metric">Metric (°C)</MenuItem>
                         <MenuItem value="imperial">Imperial (°F)</MenuItem>
                    </Select>
                    <FormControlLabel
                         control={
                              <Switch
                                   checked={showDetails}
                                   onChange={e => setShowDetails(e.target.checked)}
                              />
                         }
                         label="Show Details"
                    />
                    <Button
                         variant="contained"
                         onClick={fetchWeather}
                         sx={{ mt: 2 }}
                         data-testid="fetch-weather-btn"
                    >
                         Get Forecast
                    </Button>
                    {error && <Typography color="error" sx={{ mt: 2 }} data-testid="error-msg">{error}</Typography>}
                    <div style={{ position: 'relative', minHeight: 250 }}>
                         {loading && (
                              <div style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                                   <CircularProgress data-testid="loading-spinner" />
                              </div>
                         )}
                         {weather && (
                              <Paper sx={{ mt: 3, p: 2, background: '#f5f7fa', borderRadius: 2 }} data-testid="weather-result">
                                   <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>{weather.city?.name}</Typography>
                                   <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>Country: {weather.city?.country}</Typography>
                                   {showDetails && weather.list?.length > 0 && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                             {weather.list.slice(0, 5).map((item: any, idx: number) => (
                                                  <Paper key={item.dt_txt + '-' + item.main.temp + '-' + idx} elevation={2} sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 1 }} data-testid={`forecast-item-${idx}`}>
                                                       <div style={{ minWidth: 80 }}>
                                                            <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>{item.dt_txt.split(' ')[0]}</Typography>
                                                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>{item.dt_txt.split(' ')[1]}</Typography>
                                                       </div>
                                                       <img src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`} alt={item.weather[0].description} style={{ width: 48, height: 48, marginRight: 12 }} />
                                                       <div style={{ flex: 1 }}>
                                                            <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 700 }}>{item.main.temp}°{units === "metric" ? "C" : "F"}</Typography>
                                                            <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#555' }}>{item.weather[0].description}</Typography>
                                                       </div>
                                                       <div style={{ minWidth: 80, textAlign: 'right' }}>
                                                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>Humidity: {item.main.humidity}%</Typography>
                                                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Wind: {item.wind.speed} m/s</Typography>
                                                       </div>
                                                  </Paper>
                                             ))}
                                        </div>
                                   )}
                              </Paper>
                         )}
                    </div>
               </Paper>
          </Container>
     )
}

