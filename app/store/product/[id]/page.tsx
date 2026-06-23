"use client"
import { useEffect, useState } from "react"
import {
  Container,
  Typography,
  Grid,
  Box,
  Button,
  Rating,
  Chip,
  Paper,
  CircularProgress,
  TextField,
} from "@mui/material"
import { ArrowBack, ShoppingCart } from "@mui/icons-material"
import Link from "next/link"
import toast from "react-hot-toast"
import { useAppDispatch } from "@/lib/hooks"
import { addToCart } from "@/lib/slices/cartSlice"
import type { Product } from "@/lib/types"
import { useParams } from "next/navigation"

export default function ProductDetailsPage() {
  const params = useParams()
  const id = params?.id as string
  const dispatch = useAppDispatch()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (!id) return
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`)
        const productData = await response.json()
        setProduct(productData)
      } catch (error) {
        toast.error("Failed to load product details")
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        dispatch(addToCart(product))
      }
      toast.success(`Added ${quantity} x "${product.title}" to cart!`, {
        icon: "🛒",
        duration: 3000,
      })
    }
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading product details...
        </Typography>
      </Container>
    )
  }

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Product not found
        </Typography>
        <Button component={Link} href="/store" startIcon={<ArrowBack />}>
          Back to Store
        </Button>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button component={Link} href="/store" startIcon={<ArrowBack />} sx={{ mb: 3 }} data-testid="back-to-store">
        Back to Store
      </Button>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={2} sx={{ p: 3, textAlign: "center" }}>
            <Box
              component="img"
              src={product.image}
              alt={product.title}
              sx={{
                width: "100%",
                maxWidth: 400,
                height: "auto",
                objectFit: "contain",
              }}
              data-testid="product-detail-image"
            />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Box>
            <Chip label={product.category} sx={{ mb: 2 }} data-testid="product-detail-category" />

            <Typography variant="h4" component="h1" gutterBottom data-testid="product-detail-title">
              {product.title}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Rating value={product.rating.rate} readOnly precision={0.1} data-testid="product-detail-rating" />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                ({product.rating.count} reviews)
              </Typography>
            </Box>

            <Typography
              variant="h3"
              color="primary"
              fontWeight="bold"
              sx={{ mb: 3 }}
              data-testid="product-detail-price"
            >
              ${product.price.toFixed(2)}
            </Typography>

            <Typography variant="body1" sx={{ mb: 4 }} data-testid="product-detail-description">
              {product.description}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <TextField
                type="number"
                label="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                inputProps={{ min: 1, max: 10 }}
                sx={{ width: 120 }}
                data-testid="quantity-input"
              />
              <Button
                variant="contained"
                size="large"
                startIcon={<ShoppingCart />}
                onClick={handleAddToCart}
                data-testid="add-to-cart-detail"
              >
                Add to Cart
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  )
}
