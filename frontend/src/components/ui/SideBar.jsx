import React, { useState } from "react";
import {
  Home,
  LogOut,
  MessageCircle,
  MonitorPlay,
  Search,
  User,
  Bell,
  PlusSquare,
  Compass,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { logoutUser } from "../../redux/slices/userSlice";
import { Modal } from "./Modal";
import CreateMedia from "./CreateMedia";

const SideBar = () => {
  const { user: currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [showUploadModal, setShowUploadModal] = useState(false);

  const navItems = [
    { name: "Home",          icon: Home,         link: "/" },
    { name: "Explore",       icon: Search,       link: "/explore" },
    { name: "Reels",         icon: MonitorPlay,  link: "/reels" },
    { name: "Messages",      icon: MessageCircle,link: "/chats" },
    { name: "Notifications", icon: Bell,         link: "/notifications" },
    { name: "Profile",       icon: User,         link: `/profile/${currentUser?._id}` },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

        .sidebar {
          font-family: 'DM Sans', sans-serif;
          position: sticky;
          top: 0;
          left: 0;
          height: 100vh;
          z-index: 50;
          width: 72px;
          display: flex;
          flex-direction: column;
          background: #0a0a0f;
          border-right: 1px solid rgba(255,255,255,0.06);
          padding: 20px 12px;
          gap: 4px;
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }

        @media (min-width: 768px) {
          .sidebar { width: 240px; padding: 24px 16px; }
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 10px 20px;
          margin-bottom: 8px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .logo-mark {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 10px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px rgba(99,102,241,0.4);
        }

        .logo-text {
          font-size: 17px;
          font-weight: 600;
          color: #fff;
          letter-spacing: -0.3px;
          display: none;
        }

        @media (min-width: 768px) { .logo-text { display: block; } }

        .nav-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .nav-link {
          position: relative;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 10px;
          border-radius: 12px;
          color: #6b7280;
          text-decoration: none;
          transition: all 0.2s ease;
          cursor: pointer;
          border: none;
          background: transparent;
          width: 100%;
          text-align: left;
        }

        .nav-link:hover {
          background: rgba(255,255,255,0.05);
          color: #d1d5db;
        }

        .nav-link.active {
          background: rgba(99,102,241,0.15);
          color: #818cf8;
        }

        .nav-link.active .nav-icon {
          color: #818cf8;
        }

        .active-dot {
          position: absolute;
          left: -4px;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 20px;
          background: #6366f1;
          border-radius: 0 3px 3px 0;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .nav-link.active .active-dot {
          opacity: 1;
        }

        .nav-icon {
          flex-shrink: 0;
          transition: transform 0.2s ease;
        }

        .nav-link:hover .nav-icon {
          transform: scale(1.1);
        }

        .nav-label {
          font-size: 14px;
          font-weight: 500;
          white-space: nowrap;
          display: none;
        }

        @media (min-width: 768px) { .nav-label { display: block; } }

        .upload-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 10px;
          border-radius: 12px;
          border: 1.5px dashed rgba(99,102,241,0.4);
          background: transparent;
          color: #6366f1;
          cursor: pointer;
          transition: all 0.2s ease;
          width: 100%;
          margin-top: 4px;
        }

        .upload-btn:hover {
          background: rgba(99,102,241,0.1);
          border-color: #6366f1;
          color: #818cf8;
        }

        .upload-btn:hover .nav-icon {
          transform: scale(1.1) rotate(90deg);
        }

        .sidebar-footer {
          padding-top: 12px;
          border-top: 1px solid rgba(255,255,255,0.06);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .user-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          border-radius: 12px;
          background: rgba(255,255,255,0.03);
        }

        .avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 600;
          color: white;
          overflow: hidden;
        }

        .avatar img { width: 100%; height: 100%; object-fit: cover; }

        .user-info { display: none; flex: 1; min-width: 0; }
        @media (min-width: 768px) { .user-info { display: block; } }

        .user-name {
          font-size: 13px;
          font-weight: 600;
          color: #e5e7eb;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-handle {
          font-size: 11px;
          color: #6b7280;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 10px;
          border-radius: 12px;
          border: none;
          background: transparent;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s ease;
          width: 100%;
        }

        .logout-btn:hover {
          background: rgba(239,68,68,0.1);
          color: #f87171;
        }

        .logout-btn:hover .nav-icon {
          transform: translateX(2px);
        }
      `}</style>

      <aside className="sidebar">
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-mark">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" fill="white" fillOpacity="0.9"/>
            </svg>
          </div>
          <span className="logo-text">Circle</span>
        </div>

        {/* Nav */}
        <nav className="nav-section">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.link}
                className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
              >
                <span className="active-dot" />
                <Icon size={20} className="nav-icon" />
                <span className="nav-label">{item.name}</span>
              </NavLink>
            );
          })}

          <button
            className="upload-btn"
            onClick={() => setShowUploadModal(true)}
          >
            <PlusSquare size={20} className="nav-icon" style={{transition: "transform 0.2s ease"}} />
            <span className="nav-label">Create Post</span>
          </button>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          {currentUser && (
            <div className="user-card">
              <div className="avatar">
                {currentUser.profilePicture
                  ? <img src={currentUser.profilePicture} alt={currentUser.username} />
                  : currentUser.username?.[0]?.toUpperCase()
                }
              </div>
              <div className="user-info">
                <div className="user-name">{currentUser.name || currentUser.username}</div>
                <div className="user-handle">@{currentUser.username}</div>
              </div>
            </div>
          )}

          <button className="logout-btn" onClick={() => dispatch(logoutUser())}>
            <LogOut size={18} className="nav-icon" />
            <span className="nav-label">Log out</span>
          </button>
        </div>
      </aside>

      <Modal open={showUploadModal} onOpenChange={setShowUploadModal}>
        <CreateMedia type="post" />
      </Modal>
    </>
  );
};

export default SideBar;