import { useCallback, useEffect, useMemo, useState } from 'react';
import { api, type DiffFile, type FileStatus } from './api';
import { DiffView } from './DiffView';

const statusLabel: Record<FileStatus, string> = {
  A: 'added',
  M: 'modified',
  D: 'deleted',
  R: 'renamed',
  C: 'copied',
  T: 'type changed',
  U: 'unmerged',
  X: 'unknown',
};

export function App() {
  const [repoPath, setRepoPath] = useState('');
  const [branches, setBranches] = useState<string[]>([]);
  const [baseBranch, setBaseBranch] = useState('');
  const [compareBranch, setCompareBranch] = useState('');
  const [files, setFiles] = useState<DiffFile[]>([]);
  const [selected, setSelected] = useState<DiffFile | null>(null);
  const [layout, setLayout] = useState<'side-by-side' | 'line-by-line'>('side-by-side');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBranches = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await api.branches(repoPath);
      const all = [...data.local, ...data.remote];
      setBranches(all);
      if (!baseBranch && all.length > 0) setBaseBranch(all[0]);
      if (!compareBranch) setCompareBranch(data.current);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [repoPath, baseBranch, compareBranch]);

  const loadDiff = useCallback(async () => {
    if (!repoPath || !baseBranch || !compareBranch) return;
    setError(null);
    setLoading(true);
    setSelected(null);
    try {
      const data = await api.diff(repoPath, baseBranch, compareBranch);
      setFiles(data.files);
      if (data.files.length > 0) setSelected(data.files[0]);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [repoPath, baseBranch, compareBranch]);

  const totals = useMemo(() => {
    let add = 0;
    let del = 0;
    for (const f of files) {
      add += f.additions;
      del += f.deletions;
    }
    return { add, del };
  }, [files]);

  return (
    <div className="app">
      <header className="topbar">
        <h1>Git Diff Viewer</h1>
        <div className="controls">
          <input
            placeholder="Absolute path to repo"
            value={repoPath}
            onChange={(e) => setRepoPath(e.target.value)}
          />
          <button onClick={loadBranches} disabled={!repoPath || loading}>
            Load branches
          </button>
          <select value={baseBranch} onChange={(e) => setBaseBranch(e.target.value)}>
            <option value="">base branch</option>
            {branches.map((b) => (
              <option key={`base-${b}`} value={b}>
                {b}
              </option>
            ))}
          </select>
          <span className="dots">…</span>
          <select value={compareBranch} onChange={(e) => setCompareBranch(e.target.value)}>
            <option value="">compare branch</option>
            {branches.map((b) => (
              <option key={`cmp-${b}`} value={b}>
                {b}
              </option>
            ))}
          </select>
          <button onClick={loadDiff} disabled={!baseBranch || !compareBranch || loading}>
            Compare
          </button>
          <select value={layout} onChange={(e) => setLayout(e.target.value as typeof layout)}>
            <option value="side-by-side">Side-by-side</option>
            <option value="line-by-line">Inline</option>
          </select>
        </div>
      </header>

      {error && <div className="error">{error}</div>}

      <div className="body">
        <aside className="sidebar">
          <div className="summary">
            {files.length} files
            <span className="add"> +{totals.add}</span>
            <span className="del"> -{totals.del}</span>
          </div>
          <ul className="file-list">
            {files.map((f) => (
              <li
                key={f.path}
                className={selected?.path === f.path ? 'selected' : ''}
                onClick={() => setSelected(f)}
              >
                <span className={`badge status-${f.status}`} title={statusLabel[f.status]}>
                  {f.status}
                </span>
                <span className="path">{f.path}</span>
                <span className="stats">
                  <span className="add">+{f.additions}</span>
                  <span className="del">-{f.deletions}</span>
                </span>
              </li>
            ))}
          </ul>
        </aside>

        <main className="diff-pane">
          {selected ? (
            <DiffView
              repoPath={repoPath}
              baseBranch={baseBranch}
              compareBranch={compareBranch}
              file={selected}
              layout={layout}
            />
          ) : (
            <div className="empty">Select a file to view its diff.</div>
          )}
        </main>
      </div>
    </div>
  );
}
