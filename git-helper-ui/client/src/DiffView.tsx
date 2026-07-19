import { useEffect, useRef, useState } from 'react';
import { html as diff2htmlHtml } from 'diff2html';
import hljs from 'highlight.js';
import { api, type DiffFile } from './api';

interface Props {
  repoPath: string;
  baseBranch: string;
  compareBranch: string;
  file: DiffFile;
  layout: 'side-by-side' | 'line-by-line';
}

export function DiffView({ repoPath, baseBranch, compareBranch, file, layout }: Props) {
  const [patch, setPatch] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    api
      .fileDiff(repoPath, baseBranch, compareBranch, file.path)
      .then((data) => {
        if (!cancelled) setPatch(data.patch);
      })
      .catch((e) => {
        if (!cancelled) setError((e as Error).message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [repoPath, baseBranch, compareBranch, file.path]);

  useEffect(() => {
    if (!containerRef.current) return;
    if (!patch) {
      containerRef.current.innerHTML = '';
      return;
    }
    const rendered = diff2htmlHtml(patch, {
      drawFileList: false,
      matching: 'lines',
      outputFormat: layout,
    });
    containerRef.current.innerHTML = rendered;
    containerRef.current.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block as HTMLElement);
    });
  }, [patch, layout]);

  if (loading) return <div className="empty">Loading diff…</div>;
  if (error) return <div className="error">{error}</div>;
  return <div ref={containerRef} className="diff-container" />;
}
