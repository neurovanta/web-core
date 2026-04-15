export default function ErrorMessage({ message }: { message?: string }) {
  return (
    <p className="mt-1 text-red-500 text-15 tracking-[-0.01em]">{message}</p>
  );
}