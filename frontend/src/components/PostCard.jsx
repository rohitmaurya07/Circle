import React from "react";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MapPin,
} from "lucide-react";
import ProfileImage from "./ProfileImage";

const Postcard = ({
  post,
  image,
  username = "rohitmaurya",
  location = "Daulatabad, India",
  caption = "Building something amazing 🚀",
  likes = 1243,
  date = "2 hours ago",
}) => {

  console.log(post);
  
  return (
    <div className="max-w-sm mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">

      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <ProfileImage user={post?.user} username/>
          <div>
            <p className="font-semibold text-sm">{post?.user?.username}</p>
            <div className="flex items-center text-xs text-gray-500 gap-1">
              <MapPin size={14} />
              {location}
            </div>
          </div>
        </div>
        <button className="text-gray-400 text-xl">•••</button>
      </div>

      {/* Image Section */}
      <div className="relative">
        <img
          src={post?.mediaUrl}
          alt="post"
          className="w-full h-[400px] object-cover"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center px-4 py-3">
        <div className="flex gap-4">
          <Heart className="cursor-pointer hover:scale-110 transition" />
          <MessageCircle className="cursor-pointer hover:scale-110 transition" />
          <Send className="cursor-pointer hover:scale-110 transition" />
        </div>
        <Bookmark className="cursor-pointer hover:scale-110 transition" />
      </div>

      {/* Likes */}
      <p className="px-4 font-semibold text-sm">{post?.likes?.length.toLocaleString()} likes</p>

      {/* Caption */}
      <p className="px-4 py-2 text-sm">
        <span className="font-semibold mr-2">{post?.user?.username}</span>
        {post?.caption}
      </p>

      {/* Date */}
      <p className="px-4 pb-4 text-xs text-gray-400 uppercase tracking-wide">
        {post?.createdAt}
      </p>
    </div>
  );
};

export default Postcard;