/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import './index.css';

import {exportFile, importFile} from '@lexical/file';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import * as React from 'react';
import {useEffect, useState} from 'react';

import useModal from '../../hooks/useModal';
import {$createColumnNode} from '../../nodes/ColumnNode';
import {$createSlideNode} from '../../nodes/SlideNode';
import {INSERT_CODESANDBOX_COMMAND} from '../CodeSandboxPlugin';
import {INSERT_EXCALIDRAW_COMMAND} from '../ExcalidrawPlugin';
import {InsertImageDialog} from '../ToolbarPlugin';

export default function ToolbarPlugin2(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [modal, showModal] = useModal();

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        setActiveEditor(newEditor);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL,
    );
  }, [editor]);

  return (
    <>
      {modal}
      <nav className="ToolbarPlugin2__container">
        <ul>
          {/* <button
          onClick={() => {
            activeEditor.update(() => {
              const selection = $getSelection();
              if ($isRangeSelection(selection)) {
                selection.insertNodes([$createHeadingNode('h1')]);
              }
            });
          }}>
          H1
        </button> */}
          <li>
            <button
              onClick={() => {
                editor.update(() => {
                  const selection = $getSelection();
                  if ($isRangeSelection(selection)) {
                    const nodes = selection.getNodes();
                    const topNode = nodes[0].getTopLevelElementOrThrow();
                    topNode.insertAfter($createSlideNode());
                  } else {
                    $getRoot().append($createSlideNode());
                  }
                });
              }}
              className="ToolbarPlugin2__toolbar-item">
              <i className="icon slide" />
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                editor.update(() => {
                  activeEditor.update(() => {
                    const selection = $getSelection();
                    if ($isRangeSelection(selection)) {
                      selection.insertNodes([$createColumnNode()]);
                    }
                  });
                });
              }}
              className="ToolbarPlugin2__toolbar-item">
              <i className="icon column" />
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                showModal('Insert Image', (onClose) => (
                  <InsertImageDialog
                    activeEditor={activeEditor}
                    onClose={onClose}
                  />
                ));
              }}
              title="Image"
              aria-label="Export editor state to JSON"
              className="ToolbarPlugin2__toolbar-item">
              <i className="icon image" />
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                activeEditor.dispatchCommand(
                  INSERT_EXCALIDRAW_COMMAND,
                  undefined,
                );
              }}
              title="Excalidraw"
              aria-label="Export editor state to JSON"
              className="ToolbarPlugin2__toolbar-item">
              <i className="icon excalidraw" />
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                const sandboxID = prompt('CodeSandbox ID');
                if (typeof sandboxID === 'string') {
                  activeEditor.dispatchCommand(
                    INSERT_CODESANDBOX_COMMAND,
                    sandboxID,
                  );
                }
              }}
              title="CodeSandbox"
              aria-label="Export editor state to JSON"
              className="ToolbarPlugin2__toolbar-item">
              <i className="icon codesandbox" />
            </button>
          </li>
          <li className="toolbar-divider">
            <button
              onClick={() => importFile(editor)}
              title="Import"
              aria-label="Import editor state from JSON"
              className="ToolbarPlugin2__toolbar-item">
              <i className="icon import" />
            </button>
          </li>
          <li>
            <button
              onClick={() =>
                exportFile(editor, {
                  fileName: `Playground ${new Date().toISOString()}`,
                  source: 'Playground',
                })
              }
              title="Export"
              aria-label="Export editor state to JSON"
              className="ToolbarPlugin2__toolbar-item">
              <i className="icon export" />
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                document.body.requestFullscreen();
              }}
              title="Full screen"
              aria-label="Export editor state to JSON"
              className="ToolbarPlugin2__toolbar-item">
              <i className="icon fullscreen" />
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}
