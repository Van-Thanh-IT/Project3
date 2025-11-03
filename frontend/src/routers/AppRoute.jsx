// import React from "react";

// import HomePage from "../pages/HomePage";
// import UserPage from "../pages/UserPage";
// import AdminPage from "../pages/AdminPage";
// import StaffPage from "../pages/StaffPage";
// import SellerPage from "../pages/SellerPage";
// import NotAuthorizedPage from "../pages/NotAuthorizedPage";

// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import ProtectedRoute from "../components/ProtectedRoute";
// const AppRoute = () => {
//   return (
//     // <Router>
//     //   <Routes>
//     //     {/* Trang chung */}
//     //     <Route path="/" element={<HomePage />} />
//     //     <Route path="/profile" element={<UserPage />} />

//     //     {/* Admin routes */}
//     //     {/* nên dùng role và permission*/}
//     //     <Route
//     //       path="/admin/*"
//     //       element={
//     //         <ProtectedRoute
//     //           allowedRoles={["admin", "staff"]}
//     //           userRole={user.role}
//     //         >
//     //           <AdminPage userRole={user.role} />
//     //         </ProtectedRoute>
//     //       }
//     //     />
//     //     {/* Seller routes */}
//     //     <Route
//     //       path="/seller/*"
//     //       element={
//     //         <ProtectedRoute allowedRoles={["seller"]} userRole={user.role}>
//     //           <SellerPage />
//     //         </ProtectedRoute>
//     //       }
//     //     />

//     //     {/* Not authorized */}
//     //     <Route
//     //       path="/not-authorized"
//     //       element={<div>Không có quyền truy cập</div>}
//     //     />
//     //   </Routes>
//     // </Router>
//   );
// };

// export default AppRoute;
