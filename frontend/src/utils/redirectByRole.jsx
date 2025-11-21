
export const redirectByRole = (roles, navigate) => {
  if (!roles || roles.length === 0) {
    navigate("/login");
    return;
  }
  // Quy tắc ưu tiên: admin > seller > staff > user
  if (roles.includes("admin")) {
    navigate("/admin");
  } else if (roles.includes("seller")) {
    // navigate("/profile");
    navigate("/");
  } else if (roles.includes("staff")) {
    navigate("/admin");
  } else if (roles.includes("user")) {
    navigate("/profile");
  } else {
    navigate("/login"); 
  }
};
