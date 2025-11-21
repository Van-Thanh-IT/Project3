import { createSlice , createAsyncThunk} from "@reduxjs/toolkit";
import permissionService from "../../services/permissionService";

export const fetchPermissionsThunk = createAsyncThunk(
  "permission/fetchPermissions",
  async (_, thunkAPI) => {
    try {
      const res = await permissionService.getPermissionsWithStaffStatus();
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

export const createPermissionThunk = createAsyncThunk(
  "permission/createPermission",
  async (data, thunkAPI) => {
    try {
      const res = await permissionService.createPermission(data);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

// **Kiểm tra export assignPermissionThunk**
export const assignPermissionThunk = createAsyncThunk(
   "permission/assign",
  async (data, thunkAPI) => {
  try {
    const res = await permissionService.assignPermissionToStaff(data);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data);
  }
 }
);


const initialState = {
  permissions: [],
  loading: false,
  error: null,
};

const permissionSlice = createSlice({
  name: "permission",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // ====== Fetch all permissions ======
    builder
      .addCase(fetchPermissionsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPermissionsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.permissions = action.payload.permissions || [];
      })
      .addCase(fetchPermissionsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      });

    // ====== Create permission ======
    builder
      .addCase(createPermissionThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPermissionThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.permissions.push(action.payload);
      })
      .addCase(createPermissionThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      });
  },
});

export default permissionSlice.reducer;
