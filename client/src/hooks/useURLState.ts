import { useState, useEffect, useCallback } from "react";

interface FilterState {
  page: number;
  search: string;
  status: number | undefined;
  carrier: number | undefined;
}

export function useURLState() {
  const getInitialStateFromURL = useCallback((): FilterState => {
    const params = new URLSearchParams(window.location.search);
    return {
      page: params.get("page") ? parseInt(params.get("page")!, 10) : 1,
      search: params.get("search") || "",
      status: params.get("status")
        ? parseInt(params.get("status")!, 10)
        : undefined,
      carrier: params.get("carrier")
        ? parseInt(params.get("carrier")!, 10)
        : undefined,
    };
  }, []);

  const initialState = getInitialStateFromURL();

  const [page, setPage] = useState(initialState.page);
  const [search, setSearch] = useState(initialState.search);
  const [status, setStatus] = useState<number | undefined>(initialState.status);
  const [carrier, setCarrier] = useState<number | undefined>(
    initialState.carrier
  );

  // Update URL when state changes
  useEffect(() => {
    const params = new URLSearchParams();

    if (page > 1) params.set("page", page.toString());
    if (search) params.set("search", search);
    if (status) params.set("status", status.toString());
    if (carrier) params.set("carrier", carrier.toString());

    const newURL = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;

    window.history.pushState({}, "", newURL);
  }, [page, search, status, carrier]);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const state = getInitialStateFromURL();
      setPage(state.page);
      setSearch(state.search);
      setStatus(state.status);
      setCarrier(state.carrier);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [getInitialStateFromURL]);

  return {
    page,
    setPage,
    search,
    setSearch,
    status,
    setStatus,
    carrier,
    setCarrier,
  };
}
