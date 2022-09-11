/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
  EditorConfig,
  ElementFormatType,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  Spread,
} from 'lexical';

import {BlockWithAlignableContents} from '@lexical/react/LexicalBlockWithAlignableContents';
import {
  DecoratorBlockNode,
  SerializedDecoratorBlockNode,
} from '@lexical/react/LexicalDecoratorBlockNode';
import * as React from 'react';

type CodeSandboxComponentProps = Readonly<{
  className: Readonly<{
    base: string;
    focus: string;
  }>;
  format: ElementFormatType | null;
  nodeKey: NodeKey;
  documentID: string;
}>;

function CodeSandboxComponent({
  className,
  format,
  nodeKey,
  documentID,
}: CodeSandboxComponentProps) {
  return (
    <BlockWithAlignableContents
      className={className}
      format={format}
      nodeKey={nodeKey}>
      <iframe
        width="900"
        height="600"
        src={`https://codesandbox.io/embed/${documentID}?fontsize=14&hidenavigation=1&theme=dark`}
        allowFullScreen={true}
      />
    </BlockWithAlignableContents>
  );
}

export type SerializedCodeSandboxNode = Spread<
  {
    documentID: string;
    type: 'codeSandbox';
    version: 1;
  },
  SerializedDecoratorBlockNode
>;

export class CodeSandboxNode extends DecoratorBlockNode {
  __id: string;

  static getType(): string {
    return 'codeSandbox';
  }

  static clone(node: CodeSandboxNode): CodeSandboxNode {
    return new CodeSandboxNode(node.__id, node.__format, node.__key);
  }

  static importJSON(
    serializedNode: SerializedCodeSandboxNode,
  ): CodeSandboxNode {
    const node = $createCodeSandboxNode(serializedNode.documentID);
    node.setFormat(serializedNode.format);
    return node;
  }

  exportJSON(): SerializedCodeSandboxNode {
    return {
      ...super.exportJSON(),
      documentID: this.__id,
      type: 'codeSandbox',
      version: 1,
    };
  }

  constructor(id: string, format?: ElementFormatType, key?: NodeKey) {
    super(format, key);
    this.__id = id;
  }

  updateDOM(): false {
    return false;
  }

  getId(): string {
    return this.__id;
  }

  getTextContent(
    _includeInert?: boolean | undefined,
    _includeDirectionless?: false | undefined,
  ): string {
    return `https://www.codeSandbox.com/file/${this.__id}`;
  }

  decorate(_editor: LexicalEditor, config: EditorConfig): JSX.Element {
    const embedBlockTheme = config.theme.embedBlock || {};
    const className = {
      base: embedBlockTheme.base || '',
      focus: embedBlockTheme.focus || '',
    };
    return (
      <CodeSandboxComponent
        className={className}
        format={this.__format}
        nodeKey={this.getKey()}
        documentID={this.__id}
      />
    );
  }

  isTopLevel(): true {
    return true;
  }
}

export function $createCodeSandboxNode(documentID: string): CodeSandboxNode {
  return new CodeSandboxNode(documentID);
}

export function $isCodeSandboxNode(
  node: CodeSandboxNode | LexicalNode | null | undefined,
): node is CodeSandboxNode {
  return node instanceof CodeSandboxNode;
}
