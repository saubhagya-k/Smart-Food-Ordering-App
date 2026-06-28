import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';

const ReviewCarousel = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/reviews');
      const data = await response.json();
      
      if (data.success) {
        setReviews(data.reviews);
        setAverageRating(data.average);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
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
        <div className="text-gray-500">Loading reviews...</div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl">
        <div className="text-4xl mb-3">⭐</div>
        <h3 className="text-lg font-semibold text-gray-700">No reviews yet</h3>
        <p className="text-gray-500 text-sm mt-1">Be the first to share your experience!</p>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gradient-to-r from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">What Our Customers Say</h2>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="flex">
              {[1,2,3,4,5].map(star => (
                <span key={star} className="text-2xl">
                  {star <= Math.round(averageRating) ? '⭐' : '☆'}
                </span>
              ))}
            </div>
            <span className="text-gray-600">{averageRating.toFixed(1)} out of 5</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-500">{reviews.length} reviews</span>
          </div>
        </div>

        {/* Carousel */}
        <Slider {...settings}>
          {reviews.map((review) => (
            <div key={review._id} className="px-2">
              <div className="bg-white rounded-xl shadow-lg p-6 h-64 flex flex-col justify-between hover:shadow-xl transition-shadow">
                {/* Stars */}
                <div>
                  <div className="flex mb-3">
                    {[1,2,3,4,5].map(star => (
                      <span key={star} className="text-xl">
                        {star <= review.rating ? '⭐' : '☆'}
                      </span>
                    ))}
                  </div>
                  
                  {/* Review Text */}
                  <p className="text-gray-700 text-sm leading-relaxed line-clamp-4">
                    {review.reviewText || "No comment provided"}
                  </p>
                </div>
                
                {/* User Info */}
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <p className="font-semibold text-gray-900">{review.username}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default ReviewCarousel;