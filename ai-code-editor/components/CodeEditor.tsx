'use client';

import React, { useRef, useEffect } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { basicSetup } from 'codemirror';
import { oneDark } from '@codemirror/theme-one-dark';

interface CodeEditorProps {
  language: 'python' | 'cpp';
  value: string;
  onChange: (newValue: string) => void;
}

const editorFontTheme = EditorView.theme({
  '&': {
    fontSize: '16px',
    height: '100%',   
  },
  '.cm-gutters': {
    fontSize: '16px', 
  },
  '.cm-scroller': {
    overflow: 'auto',
  }
});


const CodeEditor: React.FC<CodeEditorProps> = ({ language, value, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    const setupEditor = () => {
      if (viewRef.current) {
        viewRef.current.destroy();
      }

      const languageExtension = language === 'python' ? python() : cpp();

      const startState = EditorState.create({
        doc: value,
        extensions: [
          basicSetup,
          keymap.of(defaultKeymap),
          languageExtension,
          oneDark,
          editorFontTheme, // <-- Apply our updated theme
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              onChange(update.state.doc.toString());
            }
          }),
        ],
      });

      const view = new EditorView({
        state: startState,
        parent: editorRef.current!,
      });

      viewRef.current = view;
    };

    setupEditor();

    return () => {
      if (viewRef.current) {
        viewRef.current.destroy();
      }
    };
  }, [language]);

  useEffect(() => {
    if (viewRef.current && value !== viewRef.current.state.doc.toString()) {
      viewRef.current.dispatch({
        changes: { from: 0, to: viewRef.current.state.doc.length, insert: value },
      });
    }
  }, [value]);


  return <div ref={editorRef} className="h-full w-full" />;
};

export default CodeEditor;