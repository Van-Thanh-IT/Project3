import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ProductShopService from "../../services/ProductService";

// --- THUNKS ---
// 1. Lấy tất cả sản phẩm
export const fetchAllProductsThunk = createAsyncThunk(
  "products/fetchAll",
  async (_, thunkAPI) => {
    try {
      const res = await ProductShopService.getAllProducts();
      return res.data.products || res.data.data || [];
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || { message: "Lỗi tải danh sách sản phẩm" });
    }
  }
);

// 3. Tạo sản phẩm
export const createProductThunk = createAsyncThunk(
  "products/create",
  async (formData, thunkAPI) => {
    try {
      const res = await ProductShopService.createProduct(formData);
      return res.data.product || res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || { message: "Lỗi tạo sản phẩm" });
    }
  }
);

// 4. Cập nhật sản phẩm
export const updateProductThunk = createAsyncThunk(
  "products/update",
  async ({ id, formData }, thunkAPI) => {
    try {
      const res = await ProductShopService.updateProduct(id, formData);
      return res.data.product || res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || { message: "Lỗi cập nhật sản phẩm" });
    }
  }
);


// 5. Admin update status
export const updateProductStatusThunk = createAsyncThunk(
  "products/updateStatus",
  async ({ id, status }, thunkAPI) => {
    try {
      const res = await ProductShopService.updateProductStatus(id, status);
      return res.data.product || res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || { message: "Lỗi cập nhật trạng thái" });
    }
  }
);

// --- SLICE ---
const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    selectedProduct: null,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearSelectedProduct: (state) => { state.selectedProduct = null },
    clearError: (state) => { state.error = null },
    clearSuccessMessage: (state) => { state.successMessage = null },
  },
  extraReducers: (builder) => {
    builder
      // --- FETCH ALL ---
      .addCase(fetchAllProductsThunk.fulfilled, (state, action) => {
        state.products = action.payload;
        state.successMessage = "Danh sách sản phẩm đã tải thành công";
      })
      // --- CREATE ---
      .addCase(createProductThunk.fulfilled, (state, action) => {
        if (action.payload) state.products.unshift(action.payload);
        state.successMessage = "Sản phẩm đã tạo thành công";
      })
      // --- UPDATE ---
      .addCase(updateProductThunk.fulfilled, (state, action) => {
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) state.products[index] = action.payload;
        if (state.selectedProduct?.id === action.payload.id) state.selectedProduct = action.payload;
        state.successMessage = "Sản phẩm đã cập nhật thành công";
      })
      // --- UPDATE STATUS ---
      .addCase(updateProductStatusThunk.fulfilled, (state, action) => {
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) state.products[index] = action.payload;
        if (state.selectedProduct?.id === action.payload.id) state.selectedProduct = action.payload;
        state.successMessage = "Trạng thái sản phẩm đã cập nhật thành công";
      })

      // --- MATCHER cho pending/rejected ---
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
          state.successMessage = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload?.message || action.error.message || "Đã xảy ra lỗi";
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/fulfilled"),
        (state) => { state.loading = false; }
      );
  }
});

export const { clearSelectedProduct, clearError, clearSuccessMessage } = productSlice.actions;
export default productSlice.reducer;
