import React, { useState } from 'react'
import { API_URL } from './../../Utils/api';
import { FiStar } from 'react-icons/fi';

const Review = () => {
  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Please select a rating')
      return
    }
    
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch(`${API_URL}/api/reviews`,  {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', 
        body: JSON.stringify({
          rating: rating,
          reviewText: reviewText
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setSubmitted(true)
        console.log('Review saved:', data)
      } else if (response.status === 401) {
        setError('Please log in to post a review.')
      } else {
        setError(data.error || 'Failed to submit review')
      }
      
    } catch (err) {
      console.warn('Error:', err)
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-basil-50 border border-basil-100 rounded-2xl p-4 text-center">
        <div className="text-basil-700 font-bold">Thanks for the review!</div>
        <div className="text-basil-700 text-sm mt-1">It now shows on the home page.</div>
      </div>
    )
  }

  return (
    <div className="border-t border-line pt-6">
      <h3 className="font-display text-2xl text-ink mb-3">How was it?</h3>
      
      {error && (
        <div className="bg-paprika-50 border border-paprika-200 rounded-xl p-3 mb-4 text-paprika-800 text-sm">
          {error}
        </div>
      )}
      
      {/* Stars */}
      <div className="flex gap-2 mb-4">
        {[1,2,3,4,5].map(star => (
          <button
            key={star}
            onClick={() => setRating(star)}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
            className="p-1 transition-transform hover:scale-110"
            disabled={isLoading}
          >
            <FiStar size={28} className={star <= rating ? "text-paprika-500 fill-paprika-500" : "text-line"} />
          </button>
        ))}
      </div>

     
      <textarea
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        placeholder="Share your experience (optional)..."
        className="w-full p-3 border border-line rounded-xl mb-4 outline-none focus:border-paprika-500 focus:ring-2 focus:ring-paprika-100"
        rows="4"
        disabled={isLoading}
      />

     
      <button
        onClick={handleSubmit}
        disabled={rating === 0 || isLoading}
        className={`w-full bg-ink text-white px-6 py-3 rounded-xl font-semibold transition ${
          rating === 0 || isLoading ? 'opacity-40 cursor-not-allowed' : 'hover:bg-black'
        }`}
      >
        {isLoading ? 'Submitting...' : 'Submit Review'}
      </button>
    </div>
  )
}

export default Review