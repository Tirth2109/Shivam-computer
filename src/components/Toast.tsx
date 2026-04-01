type ToastProps = {
  message: string;
};

export default function Toast({ message }: ToastProps) {
  return (
    <div className="fixed right-5 top-5 z-[60] rounded-lg border border-[#2a3f5d] bg-[#111b2c] px-4 py-3 text-sm text-[#ecf3ff] shadow-[0_10px_24px_rgba(0,0,0,0.35)]">
      {message}
    </div>
  );
}
