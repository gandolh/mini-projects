import express from 'express';
import cors from 'cors';
import { resolve as resolvePath, join as joinPath } from 'node:path';
import { existsSync } from 'node:fs';
import { simpleGit, type SimpleGit } from 'simple-git';

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

const PORT = Number(process.env.PORT ?? 5174);
const CLIENT_DIST = process.env.CLIENT_DIST;

function badRequest(res: express.Response, message: string) {
  return res.status(400).json({ error: message });
}

async function openRepo(repoPath: unknown): Promise<{ git: SimpleGit; absPath: string } | { error: string }> {
  if (typeof repoPath !== 'string' || repoPath.trim() === '') {
    return { error: 'repoPath is required' };
  }
  const absPath = resolvePath(repoPath);
  if (!existsSync(absPath)) {
    return { error: `Path does not exist: ${absPath}` };
  }
  const git = simpleGit(absPath);
  const isRepo = await git.checkIsRepo();
  if (!isRepo) {
    return { error: `Not a git repository: ${absPath}` };
  }
  return { git, absPath };
}

app.post('/api/branches', async (req, res) => {
  const opened = await openRepo(req.body?.repoPath);
  if ('error' in opened) return badRequest(res, opened.error);
  const { git } = opened;

  const local = await git.branchLocal();
  const remote = await git.branch(['-r']);
  res.json({
    current: local.current,
    local: local.all,
    remote: remote.all,
  });
});

type FileStatus = 'A' | 'M' | 'D' | 'R' | 'C' | 'T' | 'U' | 'X';
interface DiffFile {
  status: FileStatus;
  path: string;
  oldPath?: string;
  additions: number;
  deletions: number;
}

app.post('/api/diff', async (req, res) => {
  const { baseBranch, compareBranch } = req.body ?? {};
  const opened = await openRepo(req.body?.repoPath);
  if ('error' in opened) return badRequest(res, opened.error);
  if (typeof baseBranch !== 'string' || typeof compareBranch !== 'string') {
    return badRequest(res, 'baseBranch and compareBranch are required');
  }
  const { git } = opened;

  const range = `${baseBranch}...${compareBranch}`;

  const nameStatus = await git.raw(['diff', '--name-status', '-z', range]);
  const numstat = await git.raw(['diff', '--numstat', '-z', range]);

  const files = parseNameStatus(nameStatus);
  applyNumstat(files, numstat);

  res.json({ range, files });
});

app.post('/api/file-diff', async (req, res) => {
  const { baseBranch, compareBranch, filePath } = req.body ?? {};
  const opened = await openRepo(req.body?.repoPath);
  if ('error' in opened) return badRequest(res, opened.error);
  if (typeof baseBranch !== 'string' || typeof compareBranch !== 'string' || typeof filePath !== 'string') {
    return badRequest(res, 'baseBranch, compareBranch and filePath are required');
  }
  const { git } = opened;

  const range = `${baseBranch}...${compareBranch}`;
  const patch = await git.raw(['diff', range, '--', filePath]);
  res.json({ patch });
});

function parseNameStatus(raw: string): DiffFile[] {
  const tokens = raw.split('\0').filter((t) => t.length > 0);
  const files: DiffFile[] = [];
  let i = 0;
  while (i < tokens.length) {
    const statusToken = tokens[i++];
    const statusChar = statusToken.charAt(0) as FileStatus;
    if (statusChar === 'R' || statusChar === 'C') {
      const oldPath = tokens[i++];
      const newPath = tokens[i++];
      files.push({ status: statusChar, path: newPath, oldPath, additions: 0, deletions: 0 });
    } else {
      const path = tokens[i++];
      files.push({ status: statusChar, path, additions: 0, deletions: 0 });
    }
  }
  return files;
}

function applyNumstat(files: DiffFile[], raw: string) {
  const tokens = raw.split('\0').filter((t) => t.length > 0);
  const byPath = new Map<string, DiffFile>();
  for (const f of files) byPath.set(f.path, f);

  let i = 0;
  while (i < tokens.length) {
    const head = tokens[i++];
    const match = head.match(/^(\d+|-)\t(\d+|-)\t(.*)$/s);
    if (!match) continue;
    const [, addStr, delStr, trailing] = match;
    let path = trailing;
    if (path === '') {
      i++;
      path = tokens[i++];
    }
    const file = byPath.get(path);
    if (!file) continue;
    file.additions = addStr === '-' ? 0 : Number(addStr);
    file.deletions = delStr === '-' ? 0 : Number(delStr);
  }
}

if (CLIENT_DIST && existsSync(CLIENT_DIST)) {
  app.use(express.static(CLIENT_DIST));
  app.get(/^\/(?!api\/).*/, (_req, res) => {
    res.sendFile(joinPath(CLIENT_DIST, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`git-helper-server listening on http://localhost:${PORT}`);
});
