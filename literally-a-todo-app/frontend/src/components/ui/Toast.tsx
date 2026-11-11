import { Toast } from "@base-ui/react/toast";

/** The app's one manager, so code outside React (a mutation's `onError`) can raise a toast. */
const manager = Toast.createToastManager();

/** The call the app makes: `toast.error("Failed to update todo")`. One toast at a time, closed after 5 s. */
export const toast = {
  error: (message: string): string => manager.add({ title: message, type: "error", timeout: 5000, priority: "high" }),
};

/** Renders the toasts, once, near the root: `<Toaster />`. */
export function Toaster() {
  return (
    <Toast.Provider toastManager={manager} limit={1}>
      <Toast.Portal>
        <Toast.Viewport
          style={{
            position: "fixed",
            top: 8,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 100,
            width: "min(360px, calc(100vw - 32px))",
          }}
        >
          <ToastList />
        </Toast.Viewport>
      </Toast.Portal>
    </Toast.Provider>
  );
}

function ToastList() {
  const { toasts } = Toast.useToastManager();
  return toasts.map((item) => (
    <Toast.Root
      key={item.id}
      toast={item}
      style={{ border: "1px solid #000", background: "#fff", padding: "0 8px", fontSize: 14 }}
    >
      <Toast.Content>
        <Toast.Title />
      </Toast.Content>
    </Toast.Root>
  ));
}
