import React from "react";

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex flex-col md:flex-row items-center justify-center gap-16 text-sm text-gray-400">
          <p>Copyright © 2026 Tech Quiz Master. All rights reserved</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <span>User Policy</span>
            <span>Terms</span>
            <span>Privacy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
