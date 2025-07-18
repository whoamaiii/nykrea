import React from 'react'
import Modal from './Modal'

function DeleteConfirmationModal({ isOpen, onClose, onConfirm, studentName }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-white">
        <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
        <p className="text-[var(--text-secondary)] mb-6">
          Are you sure you want to delete <span className="font-semibold text-white">{studentName}</span>? 
          This will remove all their logs permanently. This action cannot be undone.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md text-sm font-medium bg-gray-600 hover:bg-gray-500 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md text-sm font-medium bg-red-600 hover:bg-red-500 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default DeleteConfirmationModal
