import React from "react";
import { XIcon } from "lucide-react";

const PathVisualizationModal = ({
  isOpen,
  onClose,
  onConfirm,
  pathVizImage,
  isLoading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="relative bg-white rounded-lg p-6 max-w-2xl w-full m-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <XIcon size={24} />
        </button>

        <h2 className="text-xl font-semibold mb-4">Swap Path Visualization</h2>

        <div className="mb-6">
          {pathVizImage ? (
            <img
              src={pathVizImage}
              alt="Swap path visualization"
              className="w-full"
            />
          ) : (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading || !pathVizImage}
            className="btn btn-primary"
          >
            {isLoading ? "Loading..." : "Confirm Path"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PathVisualizationModal;
