import React from "react";

const AllocationSlider = ({ token, allocation, onChange, maxAllocation }) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-700">
          {token} Target Allocation
        </label>
        <span className="text-sm text-gray-500">{allocation}%</span>
      </div>
      <input
        type="range"
        min="0"
        max={maxAllocation}
        value={allocation}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
      />
    </div>
  );
};

export default AllocationSlider;
