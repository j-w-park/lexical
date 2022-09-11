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

const SlideComponent = React.lazy(
  // @ts-ignore
  () => import('./SlideComponent'),
);

export type SerializedSlideNode = Spread<
  {
    type: 'slide';
    slide: string;
    content: SerializedEditor;
  },
  SerializedLexicalNode
>;

export class SlideNode extends DecoratorNode<JSX.Element> {
  __slide: string;
  __content: LexicalEditor;

  static getType(): string {
    return 'slide';
  }

  static clone(node: SlideNode): SlideNode {
    return new SlideNode(node.__slide, node.__content, node.__key);
  }

  constructor(slide: string, content?: LexicalEditor, key?: NodeKey) {
    super(key);
    this.__slide = slide;
    this.__content = content || createEditor();
  }

  static importJSON(serializedNode: SerializedSlideNode): SlideNode {
    const node = $createSlideNode(serializedNode.slide);
    const nestedEditor = node.__content;
    const editorState = nestedEditor.parseEditorState(
      serializedNode.content.editorState,
    );
    if (!editorState.isEmpty()) {
      nestedEditor.setEditorState(editorState);
    }
    return node;
  }

  exportJSON(): SerializedSlideNode {
    return {
      content: this.getContent().toJSON(),
      slide: this.getSlide(),
      type: 'slide',
      version: 1,
    };
  }

  createDOM(_config: EditorConfig): HTMLElement {
    return document.createElement(this.__inline ? 'span' : 'div');
  }

  updateDOM(prevNode: SlideNode): boolean {
    // If the inline property changes, replace the element
    return this.__inline !== prevNode.__inline;
  }

  getSlide(): string {
    return this.__slide;
  }

  setSlide(slide: string): void {
    const writable = this.getWritable();
    writable.__slide = slide;
  }

  getContent(): LexicalEditor {
    return this.__content;
  }

  decorate(): JSX.Element {
    return (
      <Suspense fallback={null}>
        <SlideComponent
          slide={this.__slide}
          content={this.__content}
          nodeKey={this.__key}
        />
      </Suspense>
    );
  }
}

export function $createSlideNode(
  slide = '',
  content?: LexicalEditor,
): SlideNode {
  const slideNode = new SlideNode(slide, content);
  return slideNode;
}

export function $isSlideNode(
  node: LexicalNode | null | undefined,
): node is SlideNode {
  return node instanceof SlideNode;
}
