import { useState, useEffect } from "react";
import { api } from "../services/api";
import type { Load, Status, Carrier, Pagination } from "../types";

export default function LoadsTable() {
  const [loads, setLoads] = useState<Load[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<number | undefined>(
    undefined
  );
  const [selectedCarrier, setSelectedCarrier] = useState<number | undefined>(
    undefined
  );

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchData();
  }, [currentPage, debouncedSearchTerm, selectedStatus, selectedCarrier]);

  useEffect(() => {
    fetchFilters();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getLoads({
        page: currentPage,
        limit: 10,
        search: debouncedSearchTerm || undefined,
        status: selectedStatus,
        carrier: selectedCarrier,
      });
      setLoads(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const fetchFilters = async () => {
    try {
      const [statusesData, carriersData] = await Promise.all([
        api.getStatuses(),
        api.getCarriers(),
      ]);
      setStatuses(statusesData);
      setCarriers(carriersData);
    } catch (err) {
      console.error("Failed to load filters:", err);
    }
  };

  const getStatusLabel = (statusId: number) => {
    return (
      statuses.find((s) => s.id === statusId)?.label || statusId.toString()
    );
  };

  const getCarrierLabel = (carrierId: number) => {
    return (
      carriers.find((c) => c.id === carrierId)?.label || carrierId.toString()
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const formatWeight = (weight: number) => {
    return `${weight.toLocaleString()} lbs`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value ? Number(e.target.value) : undefined);
    setCurrentPage(1);
  };

  const handleCarrierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCarrier(e.target.value ? Number(e.target.value) : undefined);
    setCurrentPage(1);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in transit":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading && loads.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Filters Skeleton */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[250px] h-10 bg-gray-200 rounded-md animate-pulse"></div>
            <div className="w-40 h-10 bg-gray-200 rounded-md animate-pulse"></div>
            <div className="w-40 h-10 bg-gray-200 rounded-md animate-pulse"></div>
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                {[...Array(8)].map((_, i) => (
                  <th key={i} className="px-4 py-3 text-left">
                    <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[...Array(10)].map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {[...Array(8)].map((_, colIndex) => (
                    <td key={colIndex} className="px-4 py-3">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Skeleton */}
        <div className="flex items-center justify-center gap-4 p-4 border-t border-gray-200">
          <div className="w-20 h-10 bg-gray-200 rounded-md animate-pulse"></div>
          <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-20 h-10 bg-gray-200 rounded-md animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Filters */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search by Load ID, Origin, or Destination..."
            aria-label="Search by Load ID, Origin, or Destination"
            aria-describedby="search-description"
            autoFocus={true}
            value={searchTerm}
            onChange={handleSearchChange}
            className="flex-1 min-w-[250px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            value={selectedStatus ?? ""}
            onChange={handleStatusChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
          >
            <option value="">All Statuses</option>
            {statuses.map((status) => (
              <option key={status.id} value={status.id}>
                {status.label}
              </option>
            ))}
          </select>
          <select
            value={selectedCarrier ?? ""}
            onChange={handleCarrierChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
          >
            <option value="">All Carriers</option>
            {carriers.map((carrier) => (
              <option key={carrier.id} value={carrier.id}>
                {carrier.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      {loads.length === 0 ? (
        <div className="p-12 text-center text-gray-500">No loads found</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Load ID
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Origin
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Destination
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Weight
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Carrier
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loads.map((load) => {
                  const statusLabel = getStatusLabel(load.status);
                  return (
                    <tr
                      key={load.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {load.id}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {load.origin}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {load.destination}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                            statusLabel
                          )}`}
                        >
                          {statusLabel}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {formatDate(load.date)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {formatWeight(load.weight)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {getCarrierLabel(load.carrier)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {formatPrice(load.price)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && (
            <div className="flex items-center justify-center gap-4 p-4 border-t border-gray-200">
              <button
                onClick={() => setCurrentPage((prev) => prev - 1)}
                disabled={!pagination.hasPreviousPage}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600 min-w-[120px] text-center">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={!pagination.hasNextPage}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
