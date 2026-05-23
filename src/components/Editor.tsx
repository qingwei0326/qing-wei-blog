import { useRef, useEffect, useCallback } from 'react';
import { EditorView, keymap, lineNumbers, highlightActiveLine } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { markdown } from '@codemirror/lang-markdown';
import { syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  onPasteImage: (file: File) => void;
  onDropImages: (files: File[]) => void;
}

export function Editor({ value, onChange, onPasteImage, onDropImages }: EditorProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  const onPasteImageRef = useRef(onPasteImage);
  const onDropImagesRef = useRef(onDropImages);

  useEffect(() => {
    onChangeRef.current = onChange;
    onPasteImageRef.current = onPasteImage;
    onDropImagesRef.current = onDropImages;
  });

  useEffect(() => {
    if (!hostRef.current) return;

    const state = EditorState.create({
      doc: value,
      extensions: [
        lineNumbers(),
        history(),
        highlightActiveLine(),
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
        markdown(),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        EditorView.lineWrapping,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChangeRef.current(update.state.doc.toString());
          }
        }),
        EditorView.domEventHandlers({
          paste: (event) => {
            const items = event.clipboardData
              ? Array.from(event.clipboardData.items)
              : [];
            const imageItem = items.find(
              (it) => it.kind === 'file' && it.type.startsWith('image/'),
            );
            if (imageItem) {
              const file = imageItem.getAsFile();
              if (file) {
                event.preventDefault();
                onPasteImageRef.current(file);
                return true;
              }
            }
            return false;
          },
          dragover: (event) => {
            if (
              event.dataTransfer &&
              Array.from(event.dataTransfer.items).some((it) => it.kind === 'file')
            ) {
              event.preventDefault();
              event.dataTransfer.dropEffect = 'copy';
            }
            return false;
          },
          drop: (event) => {
            const files = event.dataTransfer
              ? Array.from(event.dataTransfer.files)
              : [];
            const images = files.filter((f) => f.type.startsWith('image/'));
            if (images.length > 0) {
              event.preventDefault();
              onDropImagesRef.current(images);
              return true;
            }
            return false;
          },
        }),
      ],
    });

    const view = new EditorView({ state, parent: hostRef.current });
    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    if (view.state.doc.toString() === value) return;
    view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: value },
    });
  }, [value]);

  const insertAtCursor = useCallback((text: string) => {
    const view = viewRef.current;
    if (!view) return;
    const { from, to } = view.state.selection.main;
    const docText = view.state.doc.toString();
    const before = docText.slice(0, from);
    const after = docText.slice(to);
    const spacerBefore = before && !before.endsWith('\n') ? '\n' : '';
    const spacerAfter = after && !after.startsWith('\n') ? '\n' : '';
    const insert = `${spacerBefore}${text}${spacerAfter}`;
    view.dispatch({
      changes: { from, to, insert },
      selection: { anchor: from + insert.length },
    });
    view.focus();
  }, []);

  useEffect(() => {
    (window as unknown as { __editorInsert: typeof insertAtCursor })
      .__editorInsert = insertAtCursor;
  }, [insertAtCursor]);

  return <div ref={hostRef} className="h-full w-full overflow-hidden" />;
}
