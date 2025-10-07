'use client';

import React, { useRef, useEffect } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { basicSetup } from 'codemirror';
import { oneDark } from '@codemirror/theme-one-dark';

// Define the props interface
interface CodeEditorProps {
  language: 'python' | 'cpp';
  value: string;
  onChange: (newValue: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ language, value, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    // This function sets up the editor
    const setupEditor = () => {
      // Destroy the previous editor instance if it exists
      if (viewRef.current) {
        viewRef.current.destroy();
      }

      const languageExtension = language === 'python' ? python() : cpp();

      const startState = EditorState.create({
        doc: value,
        extensions: [
          basicSetup,
          keymap.of(defaultKeymap), // <-- This is the corrected line
          languageExtension,
          oneDark, // Theme
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

    // Cleanup on component unmount
    return () => {
      if (viewRef.current) {
        viewRef.current.destroy();
      }
    };
  }, [language]); // Re-create the editor only when the language changes

  // This effect synchronizes the external `value` prop with the editor's content.
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