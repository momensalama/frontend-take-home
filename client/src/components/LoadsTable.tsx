import { useState, useEffect } from "react";
import { api } from "../services/api";
import type {
  Load,
  Status,
  Carrier,
  Pagination as PaginationType,
} from "../types";
import { useURLState } from "../hooks/useURLState";
import { useDebounce } from "./useDebounce";
import {
  FilterBar,
  Pagination,
  Table,
  LoadingSkeleton,
  ErrorState,
  EmptyState,
} from "./index";

export default function LoadsTable() {
  const [loads, setLoads] = useState<Load[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [pagination, setPagination] = useState<PaginationType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // URL-synchronized filter state
  const {
    page,
    setPage,
    search,
    setSearch,
    status,
    setStatus,
    carrier,
    setCarrier,
  } = useURLState();

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    fetchData();
  }, [page, debouncedSearch, status, carrier]);

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

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getLoads({
        page,
        limit: 10,
        search: debouncedSearch || undefined,
        status,
        carrier,
      });
      setLoads(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value: number | undefined) => {
    setStatus(value);
    setPage(1);
  };

  const handleCarrierChange = (value: number | undefined) => {
    setCarrier(value);
    setPage(1);
  };

  if (loading && loads.length === 0) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <FilterBar
        searchTerm={search}
        selectedStatus={status}
        selectedCarrier={carrier}
        statuses={statuses}
        carriers={carriers}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onCarrierChange={handleCarrierChange}
      />

      {loads.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <Table loads={loads} statuses={statuses} carriers={carriers} />
          {pagination && (
            <Pagination pagination={pagination} onPageChange={setPage} />
          )}
        </>
      )}
    </div>
  );
}
