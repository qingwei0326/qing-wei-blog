import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';

interface RenameDialogProps {
  open: boolean;
  initialTitle: string;
  onClose: () => void;
  onSubmit: (newTitle: string) => void;
}

export function RenameDialog({
  open,
  initialTitle,
  onClose,
  onSubmit,
}: RenameDialogProps) {
  const [title, setTitle] = useState(initialTitle);

  useEffect(() => {
    if (open) {
      setTitle(initialTitle);
    }
  }, [open, initialTitle]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  };

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-soft dark:bg-ink-700 dark:shadow-soft-dark">
          <Dialog.Title className="text-lg font-semibold">重命名文章</Dialog.Title>
          <Dialog.Description className="mt-1 text-sm text-ink-400">
            会按新标题重新生成文件名；为保留原 URL，会自动补 permalink
          </Dialog.Description>
          <form onSubmit={submit} className="mt-4 space-y-3">
            <label className="block">
              <span className="mb-1 block text-xs text-ink-400">新标题</span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
                required
                className="w-full rounded-md border border-ink-200 bg-ink-50 px-3 py-1.5 text-sm outline-none focus:border-accent dark:border-ink-500 dark:bg-ink-600"
              />
            </label>
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
                disabled={!title.trim() || title.trim() === initialTitle.trim()}
                className="rounded-md bg-accent px-3 py-1.5 text-sm text-white hover:bg-accent-hover disabled:opacity-50 dark:bg-accent-dark dark:hover:bg-accent-darkHover"
              >
                重命名
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
