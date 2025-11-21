import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import sellerService from "../../services/sellerService";

export const fetchAllSellersThunk = createAsyncThunk(
  "seller/fetchAll",
  async (_, thunkAPI) => {
    try {
      const response = await sellerService.getAllSellers();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Lỗi lấy danh sách seller");
    }
  }
);

export const fetchPendingSellersThunk = createAsyncThunk(
  "seller/fetchPending",
  async (_, thunkAPI) => {
    try {
      const response = await sellerService.getPendingSellers();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Lỗi lấy danh sách chờ duyệt");
    }
  }
);

export const fetchRevokedSellersThunk = createAsyncThunk(
  "seller/fetchRevoked",
  async (_, thunkAPI) => {
    try {
      const response = await sellerService.getRevokedList(); 
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Lỗi lấy danh sách đã hủy");
    }
  }
);

export const fetchSellerDetailThunk = createAsyncThunk(
  "seller/fetchDetail",
  async (id, thunkAPI) => {
    try {
      const response = await sellerService.getSellerDetail(id);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Lỗi lấy chi tiết seller");
    }
  }
);

export const approveSellerThunk = createAsyncThunk(
  "seller/approve",
  async (id, thunkAPI) => {
    try {
      const response = await sellerService.approveSeller(id);
      return { ...response.data, id }; 
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Lỗi duyệt seller");
    }
  }
);

export const rejectSellerThunk = createAsyncThunk(
  "seller/reject",
  async ({ id, reason }, thunkAPI) => {
    try {
      const response = await sellerService.rejectSeller(id, reason);
      return { ...response.data, id, reason };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Lỗi từ chối seller");
    }
  }
);

export const revokeSellerThunk = createAsyncThunk(
  "seller/revoke",
  async (id, thunkAPI) => {
    try {
      const response = await sellerService.revokeSeller(id);
      return { ...response.data, id }; 
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Lỗi thu hồi quyền seller");
    }
  }
);

export const restoreSellerThunk = createAsyncThunk(
  "seller/restore",
  async (id, thunkAPI) => {
    try {
      const response = await sellerService.restoreSeller(id);
      return { ...response.data, id };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Lỗi khôi phục seller");
    }
  }
);

const initialState = {
  sellers: [],         // Danh sách đang hoạt động
  pendingSellers: [],  // Danh sách chờ duyệt
  revokedSellers: [],  // Danh sách bị từ chối/thu hồi
  loading: false,
  error: null,
  successMessage: null,
};

const sellerSlice = createSlice({
  name: "seller",
  initialState,
  reducers: {
    clearSellerState: (state) => {
      state.error = null;
      state.successMessage = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- FETCH DATA ---
      .addCase(fetchAllSellersThunk.fulfilled, (state, action) => {
        state.sellers = action.payload;
        state.loading = false;
      })
      .addCase(fetchPendingSellersThunk.fulfilled, (state, action) => {
        state.pendingSellers = action.payload;
        state.loading = false;
      })
      .addCase(fetchRevokedSellersThunk.fulfilled, (state, action) => {
        state.revokedSellers = action.payload;
        state.loading = false;
      })
      
      // --- ACTIONS (Optimistic UI Updates) ---

      // 1. APPROVE: Xóa khỏi Pending -> Thêm vào Sellers (Active)
      .addCase(approveSellerThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Duyệt thành công";
        
        const approvedItem = state.pendingSellers.find(item => item.id === action.payload.id);
        state.pendingSellers = state.pendingSellers.filter(item => item.id !== action.payload.id);
        
        // Nếu cần hiển thị ngay bên tab Active (tùy vào cấu trúc data trả về, có thể cần reload lại list active)
        // Ở đây ta tạm thời chỉ xóa khỏi pending để UI cập nhật.
      })

      // 2. REJECT: Xóa khỏi Pending -> Thêm vào Revoked
      .addCase(rejectSellerThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Đã từ chối hồ sơ";
        state.pendingSellers = state.pendingSellers.filter(item => item.id !== action.payload.id);
        // Có thể push vào revokedSellers nếu muốn cập nhật ngay lập tức
      })

      // 3. REVOKE: Xóa khỏi Sellers -> Thêm vào Revoked
      .addCase(revokeSellerThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Thu hồi quyền thành công";
        state.sellers = state.sellers.filter(user => user.id !== action.payload.id);
      })

      // 4. RESTORE: Xóa khỏi Revoked -> Thêm vào Sellers
      .addCase(restoreSellerThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Khôi phục thành công";
        // Xóa khỏi danh sách bị hủy
        state.revokedSellers = state.revokedSellers.filter(item => item.id !== action.payload.id && item.user_id !== action.payload.user_id);
      })

      // --- LOADING & ERROR HANDLERS (Dùng matcher cho gọn) ---
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => { state.loading = true; state.error = null; }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => { state.loading = false; state.error = action.payload; }
      );
  },
});

export const { clearSellerState } = sellerSlice.actions;
export default sellerSlice.reducer;