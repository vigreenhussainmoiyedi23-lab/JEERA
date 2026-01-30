import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import LinkedInPostCard from '../post/LinkedInPostCard';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function PostsSwiper({ posts, user }) {
  if (!posts || posts.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_18px_60px_rgba(0,0,0,0.35)] p-8 text-center">
        <p className="text-gray-400">No posts yet</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_18px_60px_rgba(0,0,0,0.35)] p-6">
      <h3 className="text-xl font-semibold text-white mb-4">Your Posts</h3>
      
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{
          clickable: true,
          bulletClass: 'swiper-pagination-bullet !bg-white/50',
          bulletActiveClass: 'swiper-pagination-bullet-active !bg-white',
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: true,
        }}
        breakpoints={{
          640: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 2,
          },
          1280: {
            slidesPerView: 3,
          },
        }}
        className="posts-swiper"
      >
        {posts.map((post) => (
          <SwiperSlide key={post._id}>
            <LinkedInPostCard post={post} user={user} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default PostsSwiper;
