// Header.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import WalletConnect from "./WalletConnect";

const Header = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? "text-blue-600" : "text-gray-600";
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className="text-2xl font-bold text-gray-900 hover:text-gray-700"
            >
              Portfolio Rebalancer
            </Link>
            <nav className="flex space-x-6">
              <Link
                to="/portfolio"
                className={`${isActive(
                  "/portfolio"
                )} hover:text-blue-500 font-medium`}
              >
                Portfolio
              </Link>
              <Link
                to="/analytics"
                className={`${isActive(
                  "/analytics"
                )} hover:text-blue-500 font-medium`}
              >
                Analytics
              </Link>
              <Link
                to="/settings"
                className={`${isActive(
                  "/settings"
                )} hover:text-blue-500 font-medium`}
              >
                Settings
              </Link>
            </nav>
          </div>
          <WalletConnect />
        </div>
      </div>
    </header>
  );
};

export default Header;
