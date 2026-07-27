import { Outlet } from "react-router-dom";
import { useState } from "react";
import logo from "/IMG_1039.png";
import "flowbite";
import FeedbackModal from "../FeedbackModal";

export default function Root() {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showWfsModal, setShowWfsModal] = useState(
    () => localStorage.getItem("wfs-modal-dismissed") !== "1"
  );

  return (
    <div>
      <header className="z-40">
        <nav className="fixed w-full bg-white dark:border-gray-700 border-gray-200 px-4 lg:px-6 pt-2 pb-1 dark:bg-dark-bg border-b z-10">
          <div className="flex flex-wrap justify-between items-center mx-auto">
            <div className="flex flex-row h-6 justify-center">
              <a href="/" className="flex items-center">
                <img
                  src={logo as string}
                  className="mr-3 h-6 sm:h-9"
                  alt="Geo Server Data Downloader Logo"
                />
                <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
                  Geo Server Data Downloader
                </span>
              </a>
            </div>
            <div className="flex flex-row justify-between items-center gap-3">
              <button
                onClick={() => setShowFeedbackModal(true)}
                className="inline-flex items-center h-[28px] px-3 text-sm font-medium text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 mr-1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                  />
                </svg>
                Feedback
              </button>
            </div>
          </div>
        </nav>
      </header>

      {showFeedbackModal && (
        <FeedbackModal
          key="feedback-modal"
          showModal={showFeedbackModal}
          setShowModal={setShowFeedbackModal}
        />
      )}

      {showWfsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="relative w-full max-w-2xl rounded-lg bg-white dark:bg-[#1c1917] border border-gray-200 dark:border-gray-700 shadow-xl">
            <button
              onClick={() => {
                setShowWfsModal(false);
                localStorage.setItem("wfs-modal-dismissed", "1");
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="overflow-y-auto max-h-[85vh] p-6 space-y-5">
              <div className="flex items-start gap-4">
                <img src={logo as string} className="h-14 w-14 rounded-xl flex-shrink-0" alt="Geo Server Data Downloader Logo" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                    Welcome to Geo Server Data Downloader
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    This is a free tool that makes downloading geospatial data way easier.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-gray-100 dark:bg-stone-800 p-4 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <p className="font-medium text-gray-900 dark:text-white">How it works:</p>
                  <ol className="list-decimal list-inside space-y-1.5">
                    <li>Paste a service URL and click <strong>Add</strong></li>
                    <li>The layer appears on the map. Optionally draw a boundary to limit the download area</li>
                    <li>Pick an output format</li>
                    <li>Click <strong>Download</strong>. The data is processed in your browser and saved to your computer</li>
                  </ol>
                </div>
                <div className="rounded-lg bg-gray-100 dark:bg-stone-800 p-4 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <p className="font-medium text-gray-900 dark:text-white">Supported services:</p>
                  <ul className="space-y-2">
                    <li>
                      <span className="font-medium text-gray-900 dark:text-white">ArcGIS REST</span>
                      {" "}— URLs containing <code className="text-xs bg-gray-200 dark:bg-stone-700 px-1 rounded">/FeatureServer</code> or <code className="text-xs bg-gray-200 dark:bg-stone-700 px-1 rounded">/MapServer</code>
                    </li>
                    <li>
                      <span className="font-medium text-gray-900 dark:text-white">OGC WFS</span>
                      {" "}— URLs containing <code className="text-xs bg-gray-200 dark:bg-stone-700 px-1 rounded">SERVICE=WFS</code> or ending in <code className="text-xs bg-gray-200 dark:bg-stone-700 px-1 rounded">/wfs</code>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 p-3 text-sm text-blue-800 dark:text-blue-300">
                <p className="font-medium mb-1">🆕 WFS support was just added!</p>
                <p>
                  Paste a WFS endpoint URL to browse its feature types and add them to your map. Need to find WFS endpoints? Check out{" "}
                  <a href="https://geoseer.net" target="_blank" rel="noreferrer" className="underline hover:text-blue-600 dark:hover:text-blue-100">
                    geoseer.net
                  </a>
                  , a searchable directory of public geospatial services.
                </p>
                <p className="mt-1.5 text-xs opacity-75">
                  Note: Only WFS (vector features) is supported, not WMS (raster map images).
                </p>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
                This site wouldn't be possible without{" "}
                <a href="https://gdal.org" target="_blank" rel="noreferrer" className="underline hover:text-gray-700 dark:hover:text-gray-300">
                  GDAL
                </a>
                , compiled to WebAssembly by{" "}
                <a href="https://github.com/bugra9/gdal3.js" target="_blank" rel="noreferrer" className="underline hover:text-gray-700 dark:hover:text-gray-300">
                  gdal3.js
                </a>
                . Big thanks to everyone who's contributed to these projects.
              </p>

              <button
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition-colors"
                onClick={() => {
                  setShowWfsModal(false);
                  localStorage.setItem("wfs-modal-dismissed", "1");
                }}
              >
                Get started
              </button>
            </div>
          </div>
        </div>
      )}

      <div id="main-content" className="pt-16">
        <Outlet />
      </div>
    </div>
  );
}