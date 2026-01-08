import React from "react";
import { Trash, Edit2 } from "lucide-react";
import { Navigation, Pagination, Scrollbar, A11y, Zoom } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade } from "swiper/modules";

import "swiper/css/effect-fade";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/zoom";

const PostCard = ({ post, user }) => {
  return (
    <div
      key={post._id}
      className="bg-black/30 border border-gray-800 rounded-xl p-5 shadow-md"
    >
      <div className="flex items-center justify-between  ">
        <div className="flex  items-center justify-center gap-2">
          <img
            src={post.createdBy.profilePic?.url || "/user.png"}
            className="w-10 h-10 md:w-20 md:h-20 rounded-full object-center object-cover border border-yellow-400"
            alt="profilePic"
          />
          <h1>{post.createdBy.username || "User"}</h1>
        </div>
        {user._id.toString() === post.createdBy._id.toString() && (
          <div>
            <button className="text-sm md:text-lg xl:text-2xl active:scale-110 hover:cursor-pointer text-blue-500  font-extrabold px-3 py-2 rounded-2xl">
              <Edit2 />
            </button>
            <button className="text-sm md:text-lg xl:text-2xl active:scale-110 hover:cursor-pointer text-red-600  font-extrabold px-3 py-2 rounded-2xl">
              <Trash />
            </button>
          </div>
        )}
      </div>
      <h4 className="text-xl font-semibold text-yellow-200">{post.title}</h4>
      <p className="text-gray-400">{post.description}</p>
      {post.images?.length > 0 && (
  <div className="relative mt-4 rounded-2xl overflow-hidden shadow-lg border border-gray-800/50">
    <Swiper
      modules={[Navigation, Pagination, Scrollbar, A11y, EffectFade, Zoom]}
      spaceBetween={20}
      slidesPerView={1}
      navigation
      pagination={{
        clickable: true,
        dynamicBullets: true,
      }}
      scrollbar={{ draggable: true }}
      effect="fade"
      zoom={true}
      grabCursor={true}
      className="rounded-2xl"
      breakpoints={{
        480: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }}
    >
      {post.images.map((img, index) => (
        <SwiperSlide key={img.fileId || index}>
          <div className="swiper-zoom-container relative group">
            <img
              src={img.url}
              alt={`post-${index}`}
              loading="lazy"
              className="w-full h-64 sm:h-72 md:h-80 object-cover rounded-2xl transition-transform duration-500 ease-out group-hover:scale-105"
            />
            {/* Overlay with subtle gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 rounded-2xl"></div>

            {/* Zoom icon */}
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition duration-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-yellow-400 bg-black/50 rounded-full p-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m1.6-4.9a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  </div>
)}

      <div className=" mt-5 w-full flex items-center justify-center flex-col">
        <h2>Comments</h2>
        {post.comments.length === 0 && <p>No comments yet</p>}
      </div>
    </div>
  );
};

export default PostCard;
