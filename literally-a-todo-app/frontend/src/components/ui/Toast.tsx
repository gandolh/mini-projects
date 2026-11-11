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

/**
 * Renders the toasts, once, near the root: `<Toaster />`. Top centre, just below the sticky header (one row on a
 * desktop, two on a phone): an error stays until dismissed, so it must not cover the filter tabs.
 */
export function Toaster() {
  return (
    <Toast.Provider toastManager={manager} limit={1}>
      <Toast.Portal>
        <Toast.Viewport className="fixed top-11 left-1/2 z-toast w-[min(22.5rem,calc(100vw-2rem))] -translate-x-1/2 max-sm:top-20">
          <ToastList />
        </Toast.Viewport>
      </Toast.Portal>
    </Toast.Provider>
  );
}

function ToastList() {
  const { toasts } = Toast.useToastManager();
  return toasts.map((item) => (
    <Toast.Root key={item.id} toast={item} className="border border-primary bg-surface-lowest px-2 text-body">
      <Toast.Content className="flex items-center gap-2">
        <Toast.Title className="min-w-0 flex-1 font-normal" />
        <Toast.Close
          aria-label="Dismiss"
          className="flex size-5 shrink-0 cursor-pointer items-center justify-center text-primary"
        >
          <Icon name="close" />
        </Toast.Close>
      </Toast.Content>
    </Toast.Root>
  ));
}
