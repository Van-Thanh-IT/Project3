import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import staffService from "../../services/StaffService";

// --- 1️⃣ Thunks ---
export const fetchAllStaffsThunk = createAsyncThunk(
  "staff/fetchAll",
  async (_, thunkAPI) => {
    try {
      const response = await staffService.getAllStaffs();
      return response.data.data;
      
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Lỗi lấy danh sách staff"
      );
    }
  }
);

export const createStaffThunk = createAsyncThunk(
  "staff/create",
  async (data, thunkAPI) => {
    try {
      const response = await staffService.createStaff(data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Lỗi tạo staff"
      );
    }
  }
);

export const updateStaffThunk = createAsyncThunk(
  "staff/update",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await staffService.updateStaff(id, data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Lỗi cập nhật staff"
      );
    }
  }
);

export const updateStatusThunk = createAsyncThunk(
  "staff/updateStatus",
  async ({ id, status }, thunkAPI) => {
    try {
      const response = await staffService.updateStatus(id, status);
      return { id, ...response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Lỗi cập nhật trạng thái staff"
      );
    }
  }
);

// --- 2️⃣ Slice ---
const initialState = {
  staffs: [],
  loading: false,
  error: null,
  successMessage: null,
};

const staffSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {
    clearStaffState: (state) => {
      state.error = null;
      state.successMessage = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Fulfilled ---
      .addCase(fetchAllStaffsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.staffs = action.payload;
      })
      .addCase(createStaffThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.staffs.push(action.payload);
        state.successMessage = "Tạo staff thành công";
      })
      .addCase(updateStaffThunk.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.staffs.findIndex(
          (s) => s.id === action.payload.id
        );
        if (index !== -1) state.staffs[index] = action.payload;
        state.successMessage = "Cập nhật staff thành công";
      })
      .addCase(updateStatusThunk.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.staffs.findIndex(
          (s) => s.id === action.payload.id
        );
        if (index !== -1) {
          state.staffs[index].status = action.payload.status;
        }
        state.successMessage = "Cập nhật trạng thái thành công";
      })

      // --- Matcher cho pending/rejected ---
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
          state.error = action.payload || action.error.message;
        }
      );
  },
});

export const { clearStaffState } = staffSlice.actions;
export default staffSlice.reducer;
