import React from "react";
import {
  Home,
  LogOut,
  MessageCircle,
  MonitorPlay,
  Search,
  User,
  Bell,
  PlusSquare,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { logoutUser } from "../../redux/slices/userSlice";

const SideBar = () => {
  const { user: currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const navItems = [
    { name: "Home", icon: <Home size={22} />, link: "/" },
    { name: "Explore", icon: <Search size={22} />, link: "/explore" },
    { name: "Reels", icon: <MonitorPlay size={22} />, link: "/reels" },
    { name: "Message", icon: <MessageCircle size={22} />, link: "/chats" },
    { name: "Notifications", icon: <Bell size={22} />, link: "/notifications" },
    { name: "Upload", icon: <PlusSquare size={22} />, link: "/upload" },
    { name: "Profile", icon: <User size={22} />, link: `/profile/${currentUser?._id}` },
  ];

  return (
    <aside className="sticky top-0 left-0 h-screen z-50 w-20 md:w-64 p-4 flex flex-col gap-6 border-r">
      <nav className="flex flex-col gap-6 flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.link}
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-2xl transition-all duration-300 hover:bg-gray-100 ${
                isActive ? "bg-content text-white" : ""
              }`
            }
          >
            {item.icon}
            <span className="hidden md:inline font-medium">
              {item.name}
            </span>
          </NavLink>
        ))}
      </nav>

      {/* Logout at bottom */}
      <button
        onClick={() => dispatch(logoutUser())}
        className="flex items-center gap-3 p-2 rounded-2xl transition-all duration-300 hover:bg-gray-100"
      >
        <LogOut size={22} />
        <span className="hidden md:inline font-medium">
          Logout
        </span>
      </button>
    </aside>
  );
};

export default SideBar;