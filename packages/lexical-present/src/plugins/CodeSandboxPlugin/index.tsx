/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {$insertBlockNode} from '@lexical/utils';
import {COMMAND_PRIORITY_EDITOR, createCommand, LexicalCommand} from 'lexical';
import {useEffect} from 'react';

import {
  $createCodeSandboxNode,
  CodeSandboxNode,
} from '../../nodes/CodeSandboxNode';

export const INSERT_CODESANDBOX_COMMAND: LexicalCommand<string> =
  createCommand();

export default function CodeSandboxPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([CodeSandboxNode])) {
      throw new Error(
        'CodeSandboxPlugin: CodeSandboxNode not registered on editor',
      );
    }

    return editor.registerCommand<string>(
      INSERT_CODESANDBOX_COMMAND,
      (payload) => {
        const codeSandboxNode = $createCodeSandboxNode(payload);
        $insertBlockNode(codeSandboxNode);
        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
}
