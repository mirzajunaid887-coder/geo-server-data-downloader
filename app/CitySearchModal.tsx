import React, { useState, useEffect } from "react";
import Papa from "papaparse";

// Paste your published Google Sheet CSV URL here
const GOOGLE_SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYQGHV6DSMUeWHNBIM7poL9O97rksg8vay22Eh733EqMX161-SM6cRFFvlloCYVgnbynJJl4ZQhiha/pub?output=csv";

interface FlattenedDataset {
  title: string;
  city: string;
  county: string;
  state: string;
  url: string;
}

export default function CitySearchModal() {
  const [datasets, setDatasets] = useState<FlattenedDataset[]>([]);
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

        rawData.forEach((row) => {
          // Flexible key matching for City, County, State columns
          const city = row["City Name"] || row["City"] || row["city"] || "";
          const county = row["County Name"] || row["County"] || row["county"] || "";
          const state = row["State Name"] || row["State"] || row["state"] || "";

          // Exclude metadata/location columns to find dataset category columns
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

          Object.entries(row).forEach(([key, val]) => {
            const cleanKey = key.trim();
            const cleanVal = val ? val.trim() : "";

            // Check if column is a dataset type with a valid URL
            if (
              !ignoreKeys.includes(cleanKey) &&
              cleanVal &&
              cleanVal !== "N/A" &&
              cleanVal.startsWith("http")
            ) {
              flattenedList.push({
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

  // Filter datasets by keyword across title, city, county, or state
  const filteredDatasets = datasets.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.title.toLowerCase().includes(term) ||
      item.city.toLowerCase().includes(term) ||
      item.county.toLowerCase().includes(term) ||
      item.state.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-4 text-gray-900 dark:text-white p-2">
      <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
        <h2 className="text-xl font-bold">Search Dataset Catalog</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Search layers by city, county, state, or dataset type.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search by city (e.g. Miami), county, or layer type (e.g. Parcel Data, Road Network)..."
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

      {/* Results Table */}
      {!loading && !error && (
        <div className="max-h-[55vh] overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300 sticky top-0">
              <tr>
                <th className="px-4 py-3">Dataset / Layer Name</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredDatasets.length > 0 ? (
                filteredDatasets.map((item, idx) => {
                  const locationStr =
                    [item.city, item.county, item.state].filter(Boolean).join(", ") ||
                    "N/A";

                  return (
                    <tr
                      key={idx}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                    >
                      <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">
                        {item.title}
                      </td>
                      <td className="px-4 py-3">{locationStr}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(item.url);
                            alert(
                              `Copied ${item.title} URL to clipboard!\n\nPaste it into the top Add Layer bar.`
                            );
                          }}
                          className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
                        >
                          Copy URL
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-gray-400">
                    No matching datasets found for "{searchTerm}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}