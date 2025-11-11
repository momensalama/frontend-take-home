import type { Status, Carrier } from "../types";

interface FilterBarProps {
  searchTerm: string;
  selectedStatus: number | undefined;
  selectedCarrier: number | undefined;
  statuses: Status[];
  carriers: Carrier[];
  onSearchChange: (value: string) => void;
  onStatusChange: (value: number | undefined) => void;
  onCarrierChange: (value: number | undefined) => void;
}

export function FilterBar({
  searchTerm,
  selectedStatus,
  selectedCarrier,
  statuses,
  carriers,
  onSearchChange,
  onStatusChange,
  onCarrierChange,
}: FilterBarProps) {
  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search by Load ID, Origin, or Destination..."
          aria-label="Search by Load ID, Origin, or Destination"
          aria-describedby="search-description"
          autoFocus={true}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1 min-w-[250px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <select
          value={selectedStatus ?? ""}
          onChange={(e) =>
            onStatusChange(e.target.value ? Number(e.target.value) : undefined)
          }
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
          onChange={(e) =>
            onCarrierChange(e.target.value ? Number(e.target.value) : undefined)
          }
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
  );
}
