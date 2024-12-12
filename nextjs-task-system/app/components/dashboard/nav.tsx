import React from "react";
import Link from "next/link";

export default function Nav() {
  return (
    <nav className="bg-white shadow dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex shrink-0 items-center">
              {/* Todo: Replace name with SVG file */}
              <Link
                href="/dashboard"
                className="text-2xl font-bold text-gray-900 dark:text-white"
              >
                TaskMaster
              </Link>
            </div>
          </div>
          <div className="flex items-center"></div>
        </div>
      </div>
    </nav>
  );
}
