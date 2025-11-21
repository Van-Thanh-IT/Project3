import { createSlice ,createAsyncThunk} from "@reduxjs/toolkit";
import UserService from "../../services/UserService";

export const fetchUsersThunk = createAsyncThunk(
    "user/fetchUsers",
    async (filters = {}, thunkAPI) => {
        try {
            const res = await UserService.getAllUsers(filters);
            console.log(res.data);
            return res.data; 
            
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data);
        }
    }
);
export const getUserByIdThunk = createAsyncThunk(
    "user/getUserById",
    async (id, thunkAPI) => {
        try {
            const res = await UserService.getUserById(id);
            return res.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data);
        }
    }
);
export const updateUserStatusThunk = createAsyncThunk(
    "user/update",
    async ({ id, status }, thunkAPI) => {
        try {
            const res = await UserService.updateUserStatus(id, status);
            return res.data.user;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data);
        }
    }
);


const userSlice = createSlice({
    name: "user",
    initialState: {
        users: [],
        total: 0,
        currentPage: 1,
        lastPage: 1,
        loading: false,
        error: null,
        filters: {
            search: '',
            role: '',
            status: ''
        }
    },
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
    },
    extraReducers: (builder) => {
        builder

            // Danh sách user
            .addCase(fetchUsersThunk.pending, (state) => { state.loading = true; })
            .addCase(fetchUsersThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload.data; // paginate Laravel
                state.total = action.payload.total;
                state.currentPage = action.payload.current_page;
                state.lastPage = action.payload.last_page;
            })
            .addCase(fetchUsersThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Lấy chi tiết user
            .addCase(getUserByIdThunk.fulfilled, (state, action) => {
                state.selectedUser = action.payload;
            })

            // Cập nhật trạng thái user
            .addCase(updateUserStatusThunk.fulfilled, (state, action) => {
             const updated = action.payload;
                const index = state.users.findIndex((u) => u.id === updated.id);
                if (index !== -1) {
                    state.users[index].status = updated.status;
                }
            });
    },
});

export const { setFilters } = userSlice.actions;
export default userSlice.reducer;
