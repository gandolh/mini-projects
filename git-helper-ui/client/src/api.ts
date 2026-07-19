export interface BranchesResponse {
  current: string;
  local: string[];
  remote: string[];
}

export type FileStatus = 'A' | 'M' | 'D' | 'R' | 'C' | 'T' | 'U' | 'X';

export interface DiffFile {
  status: FileStatus;
  path: string;
  oldPath?: string;
  additions: number;
  deletions: number;
}

export interface DiffResponse {
  range: string;
  files: DiffFile[];
}

async function post<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  branches: (repoPath: string) => post<BranchesResponse>('/api/branches', { repoPath }),
  diff: (repoPath: string, baseBranch: string, compareBranch: string) =>
    post<DiffResponse>('/api/diff', { repoPath, baseBranch, compareBranch }),
  fileDiff: (repoPath: string, baseBranch: string, compareBranch: string, filePath: string) =>
    post<{ patch: string }>('/api/file-diff', { repoPath, baseBranch, compareBranch, filePath }),
};
