import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { Product } from "../types"

interface ProductsState {
  items: Product[]
  loading: boolean
  error: string | null
  categories: string[]
}

const initialState: ProductsState = {
  items: [],
  loading: false,
  error: null,
  categories: [],
}

export const fetchProducts = createAsyncThunk("products/fetchProducts", async () => {
  const response = await fetch("/api/products")
  const data = await response.json()
  return data
})

export const fetchProductsByCategory = createAsyncThunk(
  "products/fetchProductsByCategory",
  async (category: string) => {
    const response = await fetch(`/api/products?category=${category}`)
    const data = await response.json()
    return data
  },
)

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false
        state.items = action.payload
        state.categories = [...new Set(action.payload.map((product) => product.category))]
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch products"
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false
        state.items = action.payload
      })
  },
})

export default productsSlice.reducer
