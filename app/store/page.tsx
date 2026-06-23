"use client"
import { useEffect, useState } from "react"
import type React from "react"

import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Box,
  Chip,
  Rating,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
} from "@mui/material"
import { GridView, ViewList } from "@mui/icons-material"
import Link from "next/link"
import toast from "react-hot-toast"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { fetchProducts, fetchProductsByCategory } from "@/lib/slices/productsSlice"
import { addToCart } from "@/lib/slices/cartSlice"
import type { Product } from "@/lib/types"

export default function StorePage() {
  const dispatch = useAppDispatch()
  const { items: products, loading, categories } = useAppSelector((state) => state.products)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  useEffect(() => {
    if (selectedCategory === "all") {
      dispatch(fetchProducts())
    } else {
      dispatch(fetchProductsByCategory(selectedCategory))
    }
  }, [dispatch, selectedCategory])

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product))
    toast.success(`Added "${product.title}" to cart!`, {
      icon: "🛒",
      duration: 2000,
    })
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    toast(`Filtering by: ${category === "all" ? "All Categories" : category}`, {
      icon: "🔍",
      duration: 1500,
    })
  }

  const handleViewModeChange = (event: React.MouseEvent<HTMLElement>, newViewMode: "grid" | "list" | null) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode)
      toast(`Switched to ${newViewMode} view`, {
        icon: newViewMode === "grid" ? "⊞" : "☰",
        duration: 1000,
      })
    }
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading products...
        </Typography>
      </Container>
    )
  }

  const renderGridView = () => (
    <Grid container spacing={3} sx={{ mt: 2 }}>
      {products.map((product) => (
        <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={product.id}>
          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              transition: "transform 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
              },
            }}
            data-testid={`product-card-${product.id}`}
          >
            <CardMedia
              component="img"
              height="120"
              image={product.image}
              alt={product.title}
              sx={{ objectFit: "contain", p: 1 }}
              data-testid={`product-image-${product.id}`}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Chip
                label={product.category}
                size="small"
                sx={{ mb: 1 }}
                data-testid={`product-category-${product.id}`}
              />
              <Typography
                variant="h6"
                component="h2"
                gutterBottom
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  minHeight: "3rem",
                }}
                data-testid={`product-title-${product.id}`}
              >
                {product.title}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Rating
                  value={product.rating.rate}
                  readOnly
                  precision={0.1}
                  size="small"
                  data-testid={`product-rating-${product.id}`}
                />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  ({product.rating.count})
                </Typography>
              </Box>
              <Typography variant="h5" color="primary" fontWeight="bold" data-testid={`product-price-${product.id}`}>
                ${product.price.toFixed(2)}
              </Typography>
            </CardContent>
            <CardActions sx={{ p: 2, pt: 0 }}>
              <Button
                size="small"
                component={Link}
                href={`/store/product/${product.id}`}
                data-testid={`view-product-${product.id}`}
              >
                View Details
              </Button>
              <Button
                size="small"
                variant="contained"
                onClick={() => handleAddToCart(product)}
                data-testid={`add-to-cart-${product.id}`}
              >
                Add to Cart
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  )

  const renderListView = () => (
    <Box sx={{ mt: 2 }}>
      {products.map((product) => (
        <Paper key={product.id} elevation={2} sx={{ mb: 2, p: 2 }} data-testid={`product-list-item-${product.id}`}>
          <Grid container spacing={2} alignItems="flex-start">
            {/* Product Image */}
            <Grid size={{ xs: 12, sm: 4 }} >
              <Box
                component="img"
                src={product.image}
                alt={product.title}
                sx={{
                  width: "100%",
                  maxWidth: 120,
                  height: 120,
                  objectFit: "contain",
                  mx: "auto",
                  display: "block",
                }}
                data-testid={`product-list-image-${product.id}`}
              />
            </Grid>

            {/* Product Info */}
            <Grid size={{ xs: 12, sm: 5 }}>
              <Box>
                <Chip
                  label={product.category}
                  size="small"
                  sx={{ mb: 1 }}
                  data-testid={`product-list-category-${product.id}`}
                />
                <Typography variant="h6" gutterBottom data-testid={`product-list-title-${product.id}`}>
                  {product.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    mb: 2,
                  }}
                >
                  {product.description}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Rating
                    value={product.rating.rate}
                    readOnly
                    precision={0.1}
                    size="small"
                    data-testid={`product-list-rating-${product.id}`}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    ({product.rating.count} reviews)
                  </Typography>
                </Box>
                <Typography
                  variant="h5"
                  color="primary"
                  fontWeight="bold"
                  data-testid={`product-list-price-${product.id}`}
                >
                  ${product.price.toFixed(2)}
                </Typography>
              </Box>
            </Grid>

            {/* Action Buttons */}
            <Grid size={{ xs: 12, sm: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "row", sm: "column" },
                  gap: 1,
                  justifyContent: { xs: "center", sm: "flex-start" },
                  alignItems: { xs: "center", sm: "stretch" },
                }}
              >
                <Button
                  component={Link}
                  href={`/store/product/${product.id}`}
                  variant="outlined"
                  size="small"
                  fullWidth
                  data-testid={`view-product-list-${product.id}`}
                >
                  View Details
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  fullWidth
                  onClick={() => handleAddToCart(product)}
                  data-testid={`add-to-cart-list-${product.id}`}
                >
                  Add to Cart
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      ))}
    </Box>
  )

  return (
    <>
      <Box sx={{
        minHeight: '100vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: -1,
        backgroundImage: 'url(/flutter.jpg)',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
      }} />
      <Box sx={{
        position: 'relative',
        zIndex: 1,
        minHeight: '100vh',
        width: '100vw',
        overflowY: 'auto',
      }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ textAlign: "center" }}>
            Fake Store
          </Typography>
          <Typography variant="body1" color="primary.white" sx={{ textAlign: "center" }}>
            Browse our collection of products for testing e-commerce scenarios
          </Typography>

          <Box
            sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}
          >
            <FormControl sx={{ minWidth: 200 }}>
              {/* <InputLabel sx={{ color: "primary.white" }}>Category</InputLabel> */}
              <Select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                // label="Category"
                data-testid="category-filter"
                sx={{
                  backgroundColor: "white",
                  color: "black",
                  "& .MuiSelect-icon": { color: "black" },
                  "& fieldset": { borderColor: "white" },
                }}
              >
                <MenuItem value="all">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category} data-testid={`category-${category}`}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={handleViewModeChange}
              aria-label="view mode"
              data-testid="view-mode-toggle"
              sx={{ color: "primary.white", backgroundColor: "rgba(255, 255, 255, 0.1)", borderRadius: 1 }}
            >
              <ToggleButton value="grid" aria-label="grid view" data-testid="grid-view-button" >
                <GridView sx={{ color: "white" }} />
              </ToggleButton>
              <ToggleButton value="list" aria-label="list view" data-testid="list-view-button">
                <ViewList sx={{ color: "white" }} />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {viewMode === "grid" ? renderGridView() : renderListView()}
        </Container>
      </Box>

    </>
  )
}
