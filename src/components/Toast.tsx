type ToastProps = {
  message: string;
};

export default function Toast({ message }: ToastProps) {
  return <div className="automation-toast">{message}</div>;
}
