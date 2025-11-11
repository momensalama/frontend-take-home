import type { Load, Status, Carrier } from "../types";
import { StatusBadge } from "./StatusBadge";

interface TableProps {
  loads: Load[];
  statuses: Status[];
  carriers: Carrier[];
}

export function Table({ loads, statuses, carriers }: TableProps) {
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

  return (
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
              <tr key={load.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-900">{load.id}</td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {load.origin}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {load.destination}
                </td>
                <td className="px-4 py-3 text-sm">
                  <StatusBadge status={statusLabel} />
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
  );
}
