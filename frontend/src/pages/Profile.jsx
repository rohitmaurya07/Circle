import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfileById } from "../redux/slices/userSlice";
import { getUserPosts } from "../redux/slices/postSlice";
import SideBar from "../components/ui/SideBar";
import ProfileImage from "../components/ProfileImage";
import PostCard from "../components/PostCard";
import { Grid3X3, Clapperboard, Bookmark } from "lucide-react";

const Profile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { userProfile, user: currentUser } = useSelector(
    (state) => state.user
  );

  console.log(currentUser);
  

  // ⚠️ make sure your store reducer name is "posts"
  const { userPosts } = useSelector((state) => state.posts);

  // active tab state
  const [activeTab, setActiveTab] = useState("posts");

  // correct profile check (NO state needed)
  const isMyProfile = id === currentUser?._id;

  useEffect(() => {
    dispatch(getUserProfileById(id));
    dispatch(getUserPosts(id));
  }, [dispatch, id]);

  return (
    <div className="flex bg-black text-white min-h-screen">
      <SideBar />

      {/* ================= MAIN ================= */}
      <div className="flex-1 max-w-5xl mx-auto px-6 py-8">

        {/* ================= HEADER ================= */}
        <div className="flex gap-16 border-b border-gray-700 pb-10 flex-wrap md:flex-nowrap">

          {/* Profile Image */}
          <div className="flex justify-center items-start w-full md:w-auto">
            <ProfileImage
              user={userProfile}
              className="w-32 h-32 md:w-36 md:h-36 rounded-full object-cover border-2 border-gray-600"
              isOnline={false}
            />
          </div>

          {/* Profile Info */}
          <div className="flex flex-col gap-5 flex-1">

            {/* Username Row */}
            <div className="flex flex-wrap items-center gap-4">
              <h1 className="text-2xl font-semibold">
                {userProfile?.username}
              </h1>

              {userProfile?.isVerified && (
                <span className="text-blue-500 text-lg">✔</span>
              )}

              {isMyProfile ? (
                <button className="bg-blue-500 px-5 py-1 rounded-md font-medium">
                  Edit Profile
                </button>
              ) : (
                <button className="bg-blue-500 px-5 py-1 rounded-md font-medium">
                  Follow
                </button>
              )}

              <button className="border border-gray-600 px-4 py-1 rounded-md">
                Message
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 text-sm">
              <p>
                <span className="font-semibold">
                  {userProfile?.posts?.length || 0}
                </span>{" "}
                posts
              </p>
              <p>
                <span className="font-semibold">
                  {userProfile?.followers?.length || 0}
                </span>{" "}
                followers
              </p>
              <p>
                <span className="font-semibold">
                  {userProfile?.following?.length || 0}
                </span>{" "}
                following
              </p>
            </div>

            {/* Bio */}
            <div>
              <p className="font-semibold">{userProfile?.username}</p>
              <p className="text-gray-400">{userProfile?.bio}</p>
            </div>
          </div>
        </div>

        {/* ================= TABS ================= */}
        <div className="flex justify-center gap-10 md:gap-16 mt-6 border-t border-gray-700 pt-4 text-sm">

          {/* POSTS */}
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex items-center gap-2 pb-3 transition-all duration-200
              ${
                activeTab === "posts"
                  ? "text-white border-t border-white -mt-[1px]"
                  : "text-gray-400 hover:text-white"
              }`}
          >
            <Grid3X3 size={18} />
            POSTS
          </button>

          {/* REELS */}
          <button
            onClick={() => setActiveTab("reels")}
            className={`flex items-center gap-2 pb-3 transition-all duration-200
              ${
                activeTab === "reels"
                  ? "text-white border-t border-white -mt-[1px]"
                  : "text-gray-400 hover:text-white"
              }`}
          >
            <Clapperboard size={18} />
            REELS
          </button>

          {/* SAVED (only my profile) */}
          {isMyProfile && (
            <button
              onClick={() => setActiveTab("saved")}
              className={`flex items-center gap-2 pb-3 transition-all duration-200
                ${
                  activeTab === "saved"
                    ? "text-white border-t border-white -mt-[1px]"
                    : "text-gray-400 hover:text-white"
                }`}
            >
              <Bookmark size={18} />
              SAVED
            </button>
          )}
        </div>

        {/* ================= CONTENT ================= */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 mt-6">

          {/* POSTS */}
          {activeTab === "posts" &&
            userPosts?.map((post) => (
              <PostCard key={post._id} post={post} place="profile" />
            ))}

          {/* REELS */}
          {activeTab === "reels" && (
            <p className="col-span-3 text-center text-gray-500 mt-10">
              Reels coming soon 🚀
            </p>
          )}

          {/* SAVED */}
          {activeTab === "saved" && (
            <p className="col-span-3 text-center text-gray-500 mt-10">
              {currentUser?.savedPosts?.length > 0 ? (
                currentUser?.savedPosts?.map((post) => (
                    <li>{post}</li>
                ))
              ) : (
                <p>No Saved Posts</p>
              )}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;