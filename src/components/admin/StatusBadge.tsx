export function StatusBadge({ status }: { status: string }) {
  const styles =
    status === 'paid'
      ? 'bg-accent-50 text-accent-700'
      : status === 'pending'
        ? 'bg-amber-50 text-amber-700'
        : 'bg-gray-100 text-gray-600'
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${styles}`}
    >
      {status}
    </span>
  )
}
