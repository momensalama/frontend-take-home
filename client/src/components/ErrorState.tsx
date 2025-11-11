interface ErrorStateProps {
  message: string;
}

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="bg-white rounded-lg shadow p-12 text-center">
      <div className="text-red-600">Error: {message}</div>
    </div>
  );
}
