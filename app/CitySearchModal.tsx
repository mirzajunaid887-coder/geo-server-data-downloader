import React, { useState, useEffect } from "react";

export interface FlattenedDataset {
  id: string;
  title: string;
  city: string;
  county: string;
  state: string;
  url: string;
  owner?: string;
}

interface CitySearchModalProps {
  onAddLayers?: (layers: FlattenedDataset[]) => void;
  onClose?: () => void;
}

interface ArcGISItem {
  id: string;
  title: string;
  url: string;
  owner?: string;
  snippet?: string;
  typeKeywords?: string[];
}

export default function CitySearchModal({ onAddLayers, onClose }: CitySearchModalProps) {
  const [datasets, setDatasets] = useState<FlattenedDataset[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("Vector");
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sub-layer Drill-down State
  const [activeParentDataset, setActiveParentDataset] = useState<FlattenedDataset | null>(null);
  const [subLayers, setSubLayers] = useState<FlattenedDataset[]>([]);
  const [selectedSubLayerIds, setSelectedSubLayerIds] = useState<Set<string>>(new Set());
  const [loadingSubLayers, setLoadingSubLayers] = useState(false);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch vector layers from ArcGIS Online Search API
  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setDatasets([]);
      return;
    }

    const fetchArcGISVectorLayers = async () => {
      setLoading(true);
      setError(null);

      try {
        const vectorFilter =
          '(type:"Feature Service" OR type:"Vector Tile Service") AND -type:"Image Service" AND -type:"Raster Layer"';
        const query = encodeURIComponent(`${debouncedSearch} AND ${vectorFilter}`);
        const apiUrl = `https://www.arcgis.com/sharing/rest/search?q=${query}&f=json&num=25&sortField=relevance&sortOrder=desc`;

        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.error) {
          throw new Error(data.error.message || "Failed to fetch vector layers from ArcGIS API.");
        }

        const items: ArcGISItem[] = data.results || [];

        const formattedResults: FlattenedDataset[] = items
          .filter((item) => item.url)
          .map((item) => ({
            id: item.id,
            title: item.title,
            city: item.snippet || "ArcGIS Vector Dataset",
            county: item.owner ? `Owner: ${item.owner}` : "",
            state: "ArcGIS Online",
            url: item.url,
            owner: item.owner,
          }));

        setDatasets(formattedResults);
      } catch (err: any) {
        console.error("Error fetching ArcGIS vector datasets:", err);
        setError(err.message || "An error occurred while querying ArcGIS Vector layers.");
      } finally {
        setLoading(false);
      }
    };

    fetchArcGISVectorLayers();
  }, [debouncedSearch]);

  // Fetch sub-layers when inspecting a dataset
  const handleInspectDataset = async (dataset: FlattenedDataset) => {
    const trimmedUrl = dataset.url.trim().replace(/\/+$/, "");

    // If already targeting a specific sub-layer index or Vector Tile Server, add directly
    if (/\/\d+$/.test(trimmedUrl) || trimmedUrl.includes("VectorTileServer")) {
      const directLayer = [
        {
          ...dataset,
          id: `${dataset.id}_${Date.now()}`,
        },
      ];
      if (onAddLayers) onAddLayers(directLayer);
      if (onClose) onClose();
      return;
    }

    setActiveParentDataset(dataset);
    setLoadingSubLayers(true);
    setSubLayers([]);
    setSelectedSubLayerIds(new Set());

    try {
      const response = await fetch(`${trimmedUrl}/layers?f=json`);
      const data = await response.json();

      if (data.layers && data.layers.length > 0) {
        const timestamp = Date.now();
        const parsedSubLayers: FlattenedDataset[] = data.layers.map(
          (sub: { id: number; name: string }, index: number) => ({
            ...dataset,
            // Unique ID combining parent ID, sub-layer index, and timestamp
            id: `${dataset.id}_sub_${sub.id}_${timestamp}_${index}`,
            title: sub.name,
            url: `${trimmedUrl}/${sub.id}`,
          })
        );

        setSubLayers(parsedSubLayers);
        // Pre-select all sub-layers by default
        setSelectedSubLayerIds(new Set(parsedSubLayers.map((s) => s.id)));
      } else {
        // Fallback to layer 0 if no explicit sub-layers array exists
        const defaultLayer = [
          {
            ...dataset,
            id: `${dataset.id}_sub_0_${Date.now()}`,
            url: `${trimmedUrl}/0`,
          },
        ];
        if (onAddLayers) onAddLayers(defaultLayer);
        if (onClose) onClose();
      }
    } catch (err) {
      console.warn("Error fetching sub-layers, falling back to /0", err);
      const defaultLayer = [
        {
          ...dataset,
          id: `${dataset.id}_sub_0_${Date.now()}`,
          url: `${trimmedUrl}/0`,
        },
      ];
      if (onAddLayers) onAddLayers(defaultLayer);
      if (onClose) onClose();
    } finally {
      setLoadingSubLayers(false);
    }
  };

  // Main search table selection toggles
  const toggleSelectId = (id: string) => {
    const updated = new Set(selectedIds);
    updated.has(id) ? updated.delete(id) : updated.add(id);
    setSelectedIds(updated);
  };

  const toggleSelectAllVisible = () => {
    const visibleIds = datasets.map((d) => d.id);
    const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.has(id));

    const updated = new Set(selectedIds);
    if (allSelected) {
      visibleIds.forEach((id) => updated.delete(id));
    } else {
      visibleIds.forEach((id) => updated.add(id));
    }
    setSelectedIds(updated);
  };

  // Sub-layer selection toggles
  const toggleSubLayerId = (id: string) => {
    const updated = new Set(selectedSubLayerIds);
    updated.has(id) ? updated.delete(id) : updated.add(id);
    setSelectedSubLayerIds(updated);
  };

  const toggleSelectAllSubLayers = () => {
    const visibleIds = subLayers.map((s) => s.id);
    const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedSubLayerIds.has(id));

    const updated = new Set(selectedSubLayerIds);
    if (allSelected) {
      visibleIds.forEach((id) => updated.delete(id));
    } else {
      visibleIds.forEach((id) => updated.add(id));
    }
    setSelectedSubLayerIds(updated);
  };

  // Add ALL selected sub-layers directly to the dashboard
  const handleAddSelectedSubLayers = () => {
    const chosenSubLayers = subLayers.filter((layer) => selectedSubLayerIds.has(layer.id));
    if (chosenSubLayers.length > 0 && onAddLayers) {
      // Pass a fresh array clone to trigger parent state updates reliably
      onAddLayers([...chosenSubLayers]);
    }
    if (onClose) onClose();
  };

  const isAllVisibleSelected =
    datasets.length > 0 && datasets.every((item) => selectedIds.has(item.id));

  const isAllSubLayersSelected =
    subLayers.length > 0 && subLayers.every((item) => selectedSubLayerIds.has(item.id));

  return (
    <div className="space-y-4 text-gray-900 dark:text-white p-2">
      {/* HEADER */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-3 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">
            {activeParentDataset ? `Sub-Layers: ${activeParentDataset.title}` : "Search ArcGIS Vector Datasets"}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {activeParentDataset
              ? "Select specific sub-layers to add to your map dashboard."
              : "Query live ArcGIS vector services directly and inspect their sub-layers."}
          </p>
        </div>
        {activeParentDataset && (
          <button
            onClick={() => setActiveParentDataset(null)}
            className="px-3 py-1.5 text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md transition"
          >
            ← Back to Search
          </button>
        )}
      </div>

      {/* VIEW MODE 1: Sub-Layer Drill-down List */}
      {activeParentDataset ? (
        <div className="space-y-3">
          {loadingSubLayers ? (
            <div className="text-center py-8 text-sm text-gray-400 flex justify-center items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              Unpacking available sub-layers...
            </div>
          ) : (
            <>
              <div className="max-h-[45vh] overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300 sticky top-0 z-10">
                    <tr>
                      <th className="p-4 w-4">
                        <input
                          type="checkbox"
                          checked={isAllSubLayersSelected}
                          onChange={toggleSelectAllSubLayers}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                        />
                      </th>
                      <th className="px-4 py-3">Sub-Layer Name</th>
                      <th className="px-4 py-3 text-right">Target URL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subLayers.map((layer) => {
                      const isSelected = selectedSubLayerIds.has(layer.id);
                      return (
                        <tr
                          key={layer.id}
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
                              onChange={() => toggleSubLayerId(layer.id)}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                            />
                          </td>
                          <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">
                            {layer.title}
                          </td>
                          <td className="px-4 py-3 text-right text-xs font-mono text-gray-400 max-w-xs truncate">
                            {layer.url}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {selectedSubLayerIds.size} sub-layer(s) selected
                </span>
                <button
                  disabled={selectedSubLayerIds.size === 0}
                  onClick={handleAddSelectedSubLayers}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition text-white ${
                    selectedSubLayerIds.size > 0
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-gray-400 cursor-not-allowed dark:bg-gray-700"
                  }`}
                >
                  Add Selected Sub-Layers ({selectedSubLayerIds.size}) to Map
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        /* VIEW MODE 2: Main Dataset Search Table */
        <>
          <div className="relative">
            <input
              type="text"
              placeholder="Search vector datasets (e.g. Lichtgrijze Canvas, Parcel Data, Roads)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            />
          </div>

          {loading && (
            <div className="text-center py-8 text-sm text-gray-400 flex justify-center items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              Searching ArcGIS vector datasets...
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm dark:bg-red-900/30 dark:border-red-800 dark:text-red-300">
              {error}
            </div>
          )}

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
                      <th className="px-4 py-3">Vector Dataset Name</th>
                      <th className="px-4 py-3">Description / Owner</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {datasets.length > 0 ? (
                      datasets.map((item) => {
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
                            <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white max-w-xs truncate">
                              {item.title}
                            </td>
                            <td className="px-4 py-3 max-w-xs truncate text-xs text-gray-500 dark:text-gray-400">
                              {item.city} {item.county && `| ${item.county}`}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                onClick={() => handleInspectDataset(item)}
                                className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition inline-flex items-center gap-1"
                              >
                                Select Layers
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                          No vector datasets found on ArcGIS for "{searchTerm}".
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {selectedIds.size} dataset(s) selected
                </span>
                <button
                  disabled={selectedIds.size === 0}
                  onClick={() => {
                    const selected = datasets.filter((item) => selectedIds.has(item.id));
                    if (selected.length > 0) handleInspectDataset(selected[0]);
                  }}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition text-white ${
                    selectedIds.size > 0
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-gray-400 cursor-not-allowed dark:bg-gray-700"
                  }`}
                >
                  Explore Selected Dataset
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}