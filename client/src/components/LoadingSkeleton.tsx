export function LoadingSkeleton() {
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
