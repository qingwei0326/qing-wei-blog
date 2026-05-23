export function formatDraft(text: string): string {
  let body = String(text || '').replace(/\r\n/g, '\n');

  let fm = '';
  const fmMatch = body.match(/^---\n[\s\S]*?\n---\n?/);
  if (fmMatch) {
    fm = fmMatch[0].replace(/\n*$/, '\n\n');
    body = body.slice(fmMatch[0].length).replace(/^\n+/, '');
  }

  const hasH1 = /^#\s+\S/m.test(body);
  if (!hasH1) {
    const idx = body.search(/\S/);
    if (idx >= 0) {
      const rest = body.slice(idx);
      const eol = rest.indexOf('\n');
      const firstLine = eol < 0 ? rest : rest.slice(0, eol);
      const trimmed = firstLine.trim();
      const looksLikeTitle =
        trimmed &&
        trimmed.length <= 60 &&
        !/[。！？.!?,，；;]$/.test(trimmed) &&
        !/^!\[/.test(trimmed) &&
        !/^[-*+>]\s/.test(trimmed) &&
        !/^#/.test(trimmed);
      if (looksLikeTitle) {
        body =
          body.slice(0, idx) + `# ${trimmed}` + (eol < 0 ? '' : rest.slice(eol));
      }
    }
  }

  const h1Match = body.match(/^#\s+(.+)$/m);
  const inferredTitle = h1Match ? h1Match[1].trim() : '';

  if (!fm) {
    const d = new Date();
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    fm = `---\ntitle: ${inferredTitle || '未命名'}\ndescription: \ndate: ${dateStr}\ntags: []\ncategories: []\n---\n\n`;
  }

  const lines = body.split('\n');
  const out: string[] = [];
  let imgCounter = 0;
  for (let i = 0; i < lines.length; i++) {
    out.push(lines[i]);
    const isStandaloneImage = /^!\[[^\]]*\]\([^)]+\)\s*$/.test(lines[i]);
    if (isStandaloneImage) {
      imgCounter += 1;
      let j = i + 1;
      while (j < lines.length && lines[j].trim() === '') j++;
      const next = (lines[j] || '').trim();
      const alreadyCaption = /^\*[^*\n]+\*$/.test(next);
      if (!alreadyCaption) {
        out.push('');
        out.push(`*P${imgCounter}｜图注*`);
      }
    }
  }
  body = out.join('\n');

  body = body.replace(/\n{3,}/g, '\n\n');
  body = body
    .split('\n')
    .map((l) => l.replace(/[ \t]+$/, ''))
    .join('\n');
  body = body.replace(/\s+$/, '') + '\n';

  return fm + body;
}
