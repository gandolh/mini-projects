import { Toast } from "@base-ui/react/toast";
import { Icon } from "../Icon";

/** The app's one manager, so code outside React (a mutation's `onError`) can raise a toast. */
const manager = Toast.createToastManager();

/**
 * The call the app makes: `toast.error("Failed to update todo")`. One toast at a time. An error stays until it is
 * dismissed (timeout 0, the base-ui skill's toast), so it can't pass by someone who looked away.
 */
export const toast = {
  error: (message: string): string => manager.add({ title: message, type: "error", timeout: 0, priority: "high" }),
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
      <Toast.Content style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Toast.Title style={{ flex: 1, minWidth: 0, fontSize: 14, fontWeight: 400 }} />
        <Toast.Close
          aria-label="Dismiss"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            width: 20,
            height: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#000",
            flexShrink: 0,
          }}
        >
          <Icon name="close" />
        </Toast.Close>
      </Toast.Content>
    </Toast.Root>
  ));
}
