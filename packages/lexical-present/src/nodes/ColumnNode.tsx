/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {LexicalEditor, SerializedEditor} from 'lexical';

import {
  createEditor,
  DecoratorNode,
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from 'lexical';
import * as React from 'react';
import {Suspense} from 'react';

const ColumnComponent = React.lazy(
  // @ts-ignore
  () => import('./ColumnComponent'),
);

export type SerializedColumnNode = Spread<
  {
    type: 'column';
    column: string;
    content1: SerializedEditor;
    content2: SerializedEditor;
  },
  SerializedLexicalNode
>;

export class ColumnNode extends DecoratorNode<JSX.Element> {
  __column: string;
  __content1: LexicalEditor;
  __content2: LexicalEditor;

  static getType(): string {
    return 'column';
  }

  static clone(node: ColumnNode): ColumnNode {
    return new ColumnNode(
      node.__column,
      node.__content1,
      node.__content2,
      node.__key,
    );
  }

  constructor(
    column: string,
    content1?: LexicalEditor,
    content2?: LexicalEditor,
    key?: NodeKey,
  ) {
    super(key);
    this.__column = column;
    this.__content1 = content1 || createEditor();
    this.__content2 = content2 || createEditor();
  }

  static importJSON(serializedNode: SerializedColumnNode): ColumnNode {
    const node = $createColumnNode(serializedNode.column);
    const nestedEditor1 = node.__content1;
    const editorState1 = nestedEditor1.parseEditorState(
      serializedNode.content1.editorState,
    );
    if (!editorState1.isEmpty()) {
      nestedEditor1.setEditorState(editorState1);
    }
    const nestedEditor2 = node.__content2;
    const editorState2 = nestedEditor2.parseEditorState(
      serializedNode.content2.editorState,
    );
    if (!editorState2.isEmpty()) {
      nestedEditor2.setEditorState(editorState2);
    }
    return node;
  }

  exportJSON(): SerializedColumnNode {
    return {
      column: this.getColumn(),
      content1: this.getContent1().toJSON(),
      content2: this.getContent2().toJSON(),
      type: 'column',
      version: 1,
    };
  }

  createDOM(_config: EditorConfig): HTMLElement {
    return document.createElement(this.__inline ? 'span' : 'div');
  }

  updateDOM(prevNode: ColumnNode): boolean {
    // If the inline property changes, replace the element
    return this.__inline !== prevNode.__inline;
  }

  getColumn(): string {
    return this.__column;
  }

  setColumn(column: string): void {
    const writable = this.getWritable();
    writable.__column = column;
  }

  getContent1(): LexicalEditor {
    return this.__content1;
  }

  getContent2(): LexicalEditor {
    return this.__content2;
  }

  decorate(): JSX.Element {
    return (
      <Suspense fallback={null}>
        <ColumnComponent
          slide=""
          content1={this.__content1}
          content2={this.__content2}
          nodeKey={this.__key}
        />
      </Suspense>
    );
  }
}

export function $createColumnNode(
  column = '',
  content1?: LexicalEditor,
  content2?: LexicalEditor,
): ColumnNode {
  const columnNode = new ColumnNode(column, content1, content2);
  return columnNode;
}

export function $isColumnNode(
  node: LexicalNode | null | undefined,
): node is ColumnNode {
  return node instanceof ColumnNode;
}
