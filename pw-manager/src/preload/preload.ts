import { contextBridge, ipcRenderer } from 'electron';
import type { Api, IPC as SharedIPC } from '../shared/api.js';
import type { CredentialInput, CopyField } from '../shared/types.js';

// Electron sandboxes preload scripts, and a sandboxed preload can require only
// 'electron' and a few Node built-ins, so ../shared/api.js cannot load here at
// runtime. The channel names are repeated instead, and `satisfies` makes the
// type-check fail if they drift from shared/api.ts.
const IPC = {
  exists: 'vault:exists',
  isLocked: 'vault:is-locked',
  setup: 'vault:setup',
  unlock: 'vault:unlock',
  lock: 'vault:lock',
  list: 'vault:list',
  add: 'vault:add',
  see: 'vault:see',
  edit: 'vault:edit',
  remove: 'vault:remove',
  copy: 'vault:copy',
  lockedEvent: 'vault:locked',
} as const satisfies typeof SharedIPC;

const api: Api = {
  vaultExists: () => ipcRenderer.invoke(IPC.exists),
  isLocked: () => ipcRenderer.invoke(IPC.isLocked),
  setup: (pw: string) => ipcRenderer.invoke(IPC.setup, pw),
  unlock: (pw: string) => ipcRenderer.invoke(IPC.unlock, pw),
  lock: () => ipcRenderer.invoke(IPC.lock),
  list: () => ipcRenderer.invoke(IPC.list),
  add: (input: CredentialInput) => ipcRenderer.invoke(IPC.add, input),
  see: (id: number) => ipcRenderer.invoke(IPC.see, id),
  edit: (id: number, input: CredentialInput) => ipcRenderer.invoke(IPC.edit, id, input),
  remove: (id: number) => ipcRenderer.invoke(IPC.remove, id),
  copy: (id: number, field: CopyField) => ipcRenderer.invoke(IPC.copy, id, field),
  onLocked: (cb: () => void) => {
    ipcRenderer.on(IPC.lockedEvent, cb);
  },
};

contextBridge.exposeInMainWorld('api', api);
