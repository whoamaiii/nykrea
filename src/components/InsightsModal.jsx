import React from 'react'

function InsightsModal({ isOpen, isLoading, response, error, onClose }) {
  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-[#1F2937] rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl border border-gray-700 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-white mb-4">AI Insights</h2>

        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            <p className="text-gray-400 mt-4">Analyzing student data...</p>
          </div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 text-red-400">
            <p className="font-semibold">Error</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Success state with AI response */}
        {response && !isLoading && !error && (
          <div className="prose prose-invert max-w-none">
            <div className="text-gray-200 whitespace-pre-wrap">{response}</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default InsightsModal
