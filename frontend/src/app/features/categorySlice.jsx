import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import categoryService from "../../services/CategoryService";

// --- Thunks ---
export const fetchCategoriesThunk = createAsyncThunk(
  "category/fetchCategories",
  async (_, thunkAPI) => {
    try {
      const res = await categoryService.getAllCategories();
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

export const createCategoryThunk = createAsyncThunk(
  "category/createCategory",
  async (data, thunkAPI) => {
    try {
      const res = await categoryService.createCategory(data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

export const updateCategoryThunk = createAsyncThunk(
  "category/updateCategory",
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await categoryService.updateCategory(id, data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

export const toggleCategoryThunk = createAsyncThunk(
  "category/toggleCategory",
  async (id, thunkAPI) => {
    try {
      const res = await categoryService.toggleCategory(id);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

// --- Slice ---
const initialState = {
  categories: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    resetCategoryState: (state) => {
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoriesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(createCategoryThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload);
      })
      .addCase(updateCategoryThunk.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.categories.findIndex(c => c.id === action.payload.id);
        if (index !== -1) state.categories[index] = action.payload;
      })
      .addCase(toggleCategoryThunk.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.categories.findIndex(c => c.id === action.payload.id);
        if (index !== -1) state.categories[index] = action.payload;
      })
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          if (action.payload?.errors) {
            // Laravel validation errors
            state.error = Object.values(action.payload.errors).flat().join(", ");
          } else {
            state.error = action.payload?.message || action.error.message;
          }
        }
      );
  },
});

export const { resetCategoryState} = categorySlice.actions;
export default categorySlice.reducer;
