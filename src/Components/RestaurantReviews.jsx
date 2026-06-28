import React, { useState, useEffect } from 'react';

const RestaurantReviews = ({ restaurantId }) => {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [restaurantId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/reviews/restaurant/${restaurantId}`);
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

  if (loading) {
    return <div className="text-center py-8">Loading reviews...</div>;
  }

  if (reviews.length === 0) {
    return (
      <div className="bg-gray-50 rounded-xl p-8 text-center">
        <div className="text-gray-400 text-5xl mb-3">⭐</div>
        <h3 className="text-lg font-semibold text-gray-700">No reviews yet</h3>
        <p className="text-gray-500 text-sm mt-1">Be the first to review this restaurant!</p>
      </div>
    );
  }

  return (
    <div className="mt-12">
      {/* Header with average rating */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex">
              {[1,2,3,4,5].map(star => (
                <span key={star} className="text-xl">
                  {star <= Math.round(averageRating) ? '⭐' : '☆'}
                </span>
              ))}
            </div>
            <span className="text-gray-600">{averageRating.toFixed(1)} out of 5</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-500">{reviews.length} reviews</span>
          </div>
        </div>
      </div>

      {/* Reviews list */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review._id} className="border border-gray-200 rounded-xl p-5 bg-white">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[1,2,3,4,5].map(star => (
                      <span key={star} className="text-lg">
                        {star <= review.rating ? '⭐' : '☆'}
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {review.reviewText && (
                  <p className="text-gray-700 mt-2">{review.reviewText}</p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  - {review.userId?.name || 'Anonymous User'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantReviews;