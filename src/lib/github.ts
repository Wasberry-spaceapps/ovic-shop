// Client-side only utility for GitHub REST API

export interface GithubSettings {
  token: string;
  owner: string;
  repo: string;
  branch: string;
}

const STORAGE_KEY = 'ovic_admin_github_settings';

export function getGithubSettings(): GithubSettings | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
}

export function saveGithubSettings(settings: GithubSettings) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function clearGithubSettings() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

const toBase64 = (str: string) => {
  const bytes = new TextEncoder().encode(str);
  const binString = Array.from(bytes, (byte) => String.fromCodePoint(byte)).join('');
  return btoa(binString);
};

const fromBase64 = (b64: string) => {
  const binString = atob(b64);
  const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0)!);
  return new TextDecoder().decode(bytes);
};

export async function getGithubFile(path: string) {
  const settings = getGithubSettings();
  if (!settings) throw new Error('Not configured');

  const res = await fetch(`https://api.github.com/repos/${settings.owner}/${settings.repo}/contents/${path}?ref=${settings.branch}`, {
    headers: {
      Authorization: `Bearer ${settings.token}`,
      Accept: 'application/vnd.github.v3+json',
      'X-GitHub-Api-Version': '2022-11-28'
    },
    // Prevent caching to always get the latest SHA
    cache: 'no-store'
  });

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`GitHub API Error: ${res.statusText}`);
  }

  const data = await res.json();
  const content = fromBase64(data.content);
  return {
    content,
    sha: data.sha,
  };
}

export async function updateGithubFile(path: string, content: string, sha: string | null, message: string) {
  const settings = getGithubSettings();
  if (!settings) throw new Error('Not configured');

  const encodedContent = toBase64(content);

  const body: any = {
    message,
    content: encodedContent,
    branch: settings.branch,
  };
  
  if (sha) {
    body.sha = sha;
  }

  const res = await fetch(`https://api.github.com/repos/${settings.owner}/${settings.repo}/contents/${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${settings.token}`,
      Accept: 'application/vnd.github.v3+json',
      'X-GitHub-Api-Version': '2022-11-28'
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(`GitHub API Error: ${res.statusText} - ${errData.message || ''}`);
  }
  
  return await res.json();
}
