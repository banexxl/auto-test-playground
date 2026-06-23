import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { Order } from "../types"

interface OrderState {
  currentOrder: Order | null
  orders: Order[]
  loading: boolean
  error: string | null
}

const initialState: OrderState = {
  currentOrder: null,
  orders: [],
  loading: false,
  error: null,
}
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (orderData: Omit<Order, "id" | "createdAt" | "status">, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data.error || "Failed to create order")
      }

      return data
    } catch (error) {
      return rejectWithValue("Failed to create order")
    }
  }
)
const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false
        state.currentOrder = action.payload
        state.orders.push(action.payload)
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to create order"
      })
  },
})

export const { clearCurrentOrder } = orderSlice.actions
export default orderSlice.reducer
