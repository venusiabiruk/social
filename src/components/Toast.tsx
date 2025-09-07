import { useEffect, useState } from "react";
import { Check, AlertTriangle } from "lucide-react";
import { ToastState } from "@/types/library";

interface ToastProps {
  toast: ToastState;
}

export default function Toast({ toast }: ToastProps) {
  const [visible, setVisible] = useState(toast.show);

  useEffect(() => {
    setVisible(toast.show);

    if (toast.show) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, 3000); // auto-hide after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  if (!visible) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-xs w-full p-2.5 rounded-lg shadow-md flex items-center gap-2.5 border-l-4 transform transition-all duration-300 ease-out
        ${
          toast.type === "success"
            ? "bg-gray-900 border-green-500 text-white"
            : "bg-gray-900 border-yellow-500 text-white"
        }`}
    >
      {/* Icon */}
      <div className="flex-shrink-0 p-1.5 rounded-full bg-gray-800/50">
        {toast.type === "success" ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <AlertTriangle className="w-4 h-4 text-yellow-400" />
        )}
      </div>

      {/* Message */}
      <div className="flex-1 text-xs sm:text-sm font-medium">
        {toast.message}
      </div>
    </div>
  );
}
