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
 * Renders the toasts, once, near the root: `<Toaster />`. Top centre, just below the sticky header, on a wide screen;
 * a bar along the bottom with a 16 px inset on a phone, clear of the pinned head band and the add row. An error stays
 * until dismissed, so it must not cover the filter.
 */
export function Toaster() {
  return (
    <Toast.Provider toastManager={manager} limit={1}>
      <Toast.Portal>
        <Toast.Viewport className="fixed top-14 left-1/2 z-toast w-[min(26rem,calc(100vw-2rem))] -translate-x-1/2 max-sm:inset-x-4 max-sm:top-auto max-sm:bottom-4 max-sm:w-auto max-sm:translate-x-0">
          <ToastList />
        </Toast.Viewport>
      </Toast.Portal>
    </Toast.Provider>
  );
}

function ToastList() {
  const { toasts } = Toast.useToastManager();
  return toasts.map((item) => (
    <Toast.Root key={item.id} toast={item} className="border-2 border-primary bg-surface-lowest pr-1 pl-4 text-body">
      <Toast.Content className="flex min-h-12 items-center gap-3">
        <Icon name="error" className="shrink-0 text-danger" />
        <Toast.Title className="min-w-0 flex-1 font-normal" />
        <Toast.Close className="h-10 shrink-0 cursor-pointer border border-primary px-3 font-bold text-primary active:bg-primary active:text-on-primary">
          Dismiss
        </Toast.Close>
      </Toast.Content>
    </Toast.Root>
  ));
}
