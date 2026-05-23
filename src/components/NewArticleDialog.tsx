import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import type { CreateArticlePayload } from '@/types';

interface NewArticleDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateArticlePayload) => void;
}

export function NewArticleDialog({ open, onClose, onSubmit }: NewArticleDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (open) {
      setTitle('');
      setDescription('');
      setTags('');
      setCategory('');
    }
  }, [open]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onSubmit({ title: trimmed, description, tags, category });
  };

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-soft dark:bg-ink-700 dark:shadow-soft-dark">
          <Dialog.Title className="text-lg font-semibold">新建文章</Dialog.Title>
          <Dialog.Description className="mt-1 text-sm text-ink-400">
            填写基础信息后自动生成 frontmatter
          </Dialog.Description>
          <form onSubmit={submit} className="mt-4 space-y-3">
            <Field label="标题">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
                required
                className="w-full rounded-md border border-ink-200 bg-ink-50 px-3 py-1.5 text-sm outline-none focus:border-accent dark:border-ink-500 dark:bg-ink-600"
              />
            </Field>
            <Field label="描述">
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-md border border-ink-200 bg-ink-50 px-3 py-1.5 text-sm outline-none focus:border-accent dark:border-ink-500 dark:bg-ink-600"
              />
            </Field>
            <Field label="标签">
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="逗号分隔"
                className="w-full rounded-md border border-ink-200 bg-ink-50 px-3 py-1.5 text-sm outline-none focus:border-accent dark:border-ink-500 dark:bg-ink-600"
              />
            </Field>
            <Field label="分类">
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-md border border-ink-200 bg-ink-50 px-3 py-1.5 text-sm outline-none focus:border-accent dark:border-ink-500 dark:bg-ink-600"
              />
            </Field>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md bg-ink-100 px-3 py-1.5 text-sm hover:bg-ink-200 dark:bg-ink-600 dark:hover:bg-ink-500"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={!title.trim()}
                className="rounded-md bg-accent px-3 py-1.5 text-sm text-white hover:bg-accent-hover disabled:opacity-50 dark:bg-accent-dark dark:hover:bg-accent-darkHover"
              >
                创建
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-ink-400">{label}</span>
      {children}
    </label>
  );
}
