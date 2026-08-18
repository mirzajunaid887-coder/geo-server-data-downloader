import React, { useState, useEffect } from "react";
import Papa from "papaparse";

const GOOGLE_SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYQGHV6DSMUeWHNBIM7poL9O97rksg8vay22Eh733EqMX161-SM6cRFFvlloCYVgnbynJJl4ZQhiha/pub?output=csv";

export interface FlattenedDataset {
  id: string;
  title: string;
  city: string;
  county: string;
  state: string;
  url: string;
}

interface CitySearchModalProps {
  onAddLayers?: (layers: FlattenedDataset[]) => void;
  onClose?: () => void;
}

export default function CitySearchModal({ onAddLayers, onClose }: CitySearchModalProps) {
  const [datasets, setDatasets] = useState<FlattenedDataset[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!GOOGLE_SHEET_CSV_URL || GOOGLE_SHEET_CSV_URL.includes("2PACX-1vQ...")) {
      setLoading(false);
      setError("Please set GOOGLE_SHEET_CSV_URL inside app/CitySearchModal.tsx");
      return;
    }

    Papa.parse(GOOGLE_SHEET_CSV_URL, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rawData = results.data as Record<string, string>[];
        const flattenedList: FlattenedDataset[] = [];

        rawData.forEach((row, rowIdx) => {
          const city = row["City Name"] || row["City"] || row["city"] || "";
          const county = row["County Name"] || row["County"] || row["county"] || "";
          const state = row["State Name"] || row["State"] || row["state"] || "";

          const ignoreKeys = [
            "",
            "City Name",
            "City",
            "County Name",
            "County",
            "State Name",
            "State",
            "Comments",
            "Notes",
          ];

          Object.entries(row).forEach(([key, val], colIdx) => {
            const cleanKey = key.trim();
            const cleanVal = val ? val.trim() : "";

            if (
              !ignoreKeys.includes(cleanKey) &&
              cleanVal &&
              cleanVal !== "N/A" &&
              cleanVal.startsWith("http")
            ) {
              flattenedList.push({
                id: `${rowIdx}-${colIdx}`,
                title: cleanKey,
                city,
                county,
                state,
                url: cleanVal,
              });
            }
          });
        });

        setDatasets(flattenedList);
        setLoading(false);
      },
      error: (err) => {
        console.error("Error parsing Google Sheet CSV:", err);
        setError("Failed to fetch dataset catalog from Google Sheets.");
        setLoading(false);
      },
    });
  }, []);

  // Filter datasets by search keyword
  const filteredDatasets = datasets.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.title.toLowerCase().includes(term) ||
      item.city.toLowerCase().includes(term) ||
      item.county.toLowerCase().includes(term) ||
      item.state.toLowerCase().includes(term)
    );
  });

  // Toggle single item selection by unique ID
  const toggleSelectId = (id: string) => {
    const updated = new Set(selectedIds);
    if (updated.has(id)) {
      updated.delete(id);
    } else {
      updated.add(id);
    }
    setSelectedIds(updated);
  };

  // Select / Deselect all visible items
  const toggleSelectAllVisible = () => {
    const visibleIds = filteredDatasets.map((d) => d.id);
    const allSelected = visibleIds.every((id) => selectedIds.has(id));

    const updated = new Set(selectedIds);
    if (allSelected) {
      visibleIds.forEach((id) => updated.delete(id));
    } else {
      visibleIds.forEach((id) => updated.add(id));
    }
    setSelectedIds(updated);
  };

  // Add selected items to map
  const handleAddSelected = () => {
    if (selectedIds.size === 0) return;
    const selectedDatasets = datasets.filter((item) => selectedIds.has(item.id));
    if (onAddLayers) {
      onAddLayers(selectedDatasets);
    }
    if (onClose) {
      onClose();
    }
  };

  // Add a single item directly to map
  const handleAddSingle = (item: FlattenedDataset) => {
    if (onAddLayers) {
      onAddLayers([item]);
    }
    if (onClose) {
      onClose();
    }
  };

  const isAllVisibleSelected =
    filteredDatasets.length > 0 &&
    filteredDatasets.every((item) => selectedIds.has(item.id));

  return (
    <div className="space-y-4 text-gray-900 dark:text-white p-2">
      <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
        <h2 className="text-xl font-bold">Search Dataset Catalog</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Select single or multiple layers to load them directly onto your map.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search by city (e.g. London), Region, or layer type (e.g. Parcel Data, Road Network)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
        />
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className="text-center py-8 text-sm text-gray-400">
          Loading catalog from Google Sheets...
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm dark:bg-red-900/30 dark:border-red-800 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Dataset Results Table */}
      {!loading && !error && (
        <>
          <div className="max-h-[50vh] overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300 sticky top-0 z-10">
                <tr>
                  <th className="p-4 w-4">
                    <input
                      type="checkbox"
                      checked={isAllVisibleSelected}
                      onChange={toggleSelectAllVisible}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </th>
                  <th className="px-4 py-3">Dataset / Layer Name</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredDatasets.length > 0 ? (
                  filteredDatasets.map((item) => {
                    const locationStr =
                      [item.city, item.county, item.state].filter(Boolean).join(", ") ||
                      "N/A";
                    const isSelected = selectedIds.has(item.id);

                    return (
                      <tr
                        key={item.id}
                        className={`border-b dark:border-gray-700 transition ${
                          isSelected
                            ? "bg-blue-50/50 dark:bg-blue-900/20"
                            : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        }`}
                      >
                        <td className="w-4 p-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectId(item.id)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                          />
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">
                          {item.title}
                        </td>
                        <td className="px-4 py-3">{locationStr}</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleAddSingle(item)}
                            className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition inline-flex items-center gap-1"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              stroke="currentColor"
                              className="w-3.5 h-3.5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 4.5v15m7.5-7.5h-15"
                              />
                            </svg>
                            Add to Map
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                      No matching datasets found for "{searchTerm}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Batch Selection Action Bar */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {selectedIds.size} layer(s) selected
            </span>
            <button
              disabled={selectedIds.size === 0}
              onClick={handleAddSelected}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition text-white ${
                selectedIds.size > 0
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-gray-400 cursor-not-allowed dark:bg-gray-700"
              }`}
            >
              Add Selected ({selectedIds.size}) to Map
            </button>
          </div>
        </>
      )}
    </div>
  );
}