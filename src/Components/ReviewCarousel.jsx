import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { FiStar } from 'react-icons/fi';
import { API_URL } from './../../Utils/api';

const ReviewCarousel = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${API_URL}/api/reviews`);
      if (!response.ok) {
        throw new Error(`Reviews request failed: ${response.status}`);
      }
      const data = await response.json();

      if (data.success) {
        setReviews(data.reviews);
        setAverageRating(data.average);
      }
    } catch (error) {
      console.warn('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  // Carousel settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-stone-warm">Loading reviews...</div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center py-12 bg-cream border border-line rounded-3xl">
          <h3 className="font-display text-2xl text-ink">No reviews yet</h3>
          <p className="text-stone-warm text-sm mt-1">Order something and be the first to share how it was.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-paprika-700">Reviews</p>
          <h2 className="mt-1 font-display text-3xl md:text-4xl text-ink">What people are saying</h2>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="flex">
              {[1,2,3,4,5].map(star => (
                <FiStar key={star} size={18} className={star <= Math.round(averageRating) ? "text-paprika-500 fill-paprika-500" : "text-line"} />
              ))}
            </div>
            <span className="text-stone-warm">{averageRating.toFixed(1)} out of 5</span>
            <span className="text-line">•</span>
            <span className="text-stone-warm">{reviews.length} reviews</span>
          </div>
        </div>

        {/* Carousel */}
        <Slider {...settings}>
          {reviews.map((review) => (
            <div key={review._id} className="px-2">
              <div className="bg-white rounded-2xl border border-line p-6 h-64 flex flex-col justify-between">
                {/* Stars */}
                <div>
                  <div className="flex mb-3">
                    {[1,2,3,4,5].map(star => (
                      <FiStar key={star} size={16} className={star <= review.rating ? "text-paprika-500 fill-paprika-500" : "text-line"} />
                    ))}
                  </div>
                  
                  {/* Review Text */}
                  <p className="text-ink text-sm leading-relaxed line-clamp-4">
                    {review.reviewText || "No comment provided"}
                  </p>
                </div>
                
                {/* User Info */}
                <div className="mt-4 pt-3 border-t border-line">
                  <p className="font-semibold text-ink">{review.username}</p>
                  <p className="text-xs text-stone-warm">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default ReviewCarousel;