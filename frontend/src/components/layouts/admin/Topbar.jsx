import { Menu, User } from "lucide-react";

const Topbar = () => {
  return (
    <div className="flex items-center justify-between h-16 px-4 bg-white shadow">
      <button className="lg:hidden p-2 rounded hover:bg-gray-100">
        <Menu size={22} />
      </button>
      <h1 className="text-lg font-semibold">Admin</h1>
      <User size={22} />
    </div>
  );
};

export default Topbar;
