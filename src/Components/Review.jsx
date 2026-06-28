import React, { useState } from 'react'

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
      const response = await fetch('http://localhost:8080/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Sends session cookie - backend gets user from this
        body: JSON.stringify({
          rating: rating,
          reviewText: reviewText
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setSubmitted(true)
        console.log('Review saved:', data)
      } else {
        setError(data.error || 'Failed to submit review')
      }
      
    } catch (err) {
      console.error('Error:', err)
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <div className="text-green-600 text-lg mb-2">✓</div>
        <div className="text-green-800 font-semibold">Thank you for your review!</div>
        <div className="text-green-600 text-sm mt-1">Your feedback helps us improve</div>
      </div>
    )
  }

  return (
    <div className="border-t pt-6 mt-6">
      <h3 className="text-lg font-semibold mb-4">Rate Your Experience</h3>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-red-700 text-sm">
          {error}
        </div>
      )}
      
      {/* Stars */}
      <div className="flex gap-2 mb-4">
        {[1,2,3,4,5].map(star => (
          <button
            key={star}
            onClick={() => setRating(star)}
            className="text-3xl focus:outline-none transition-transform hover:scale-110"
            disabled={isLoading}
          >
            {star <= rating ? '⭐' : '☆'}
          </button>
        ))}
      </div>

      {/* Text input */}
      <textarea
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        placeholder="Share your experience (optional)..."
        className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-green-500 focus:border-transparent"
        rows="4"
        disabled={isLoading}
      />

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={rating === 0 || isLoading}
        className={`w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all ${
          rating === 0 || isLoading
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:from-green-700 hover:to-green-800 hover:scale-[1.02]'
        }`}
      >
        {isLoading ? 'Submitting...' : 'Submit Review'}
      </button>
    </div>
  )
}

export default Review