/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import './App.css';
import './themes/PlaygroundEditorTheme.css';

import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {PlainTextPlugin} from '@lexical/react/LexicalPlainTextPlugin';
import * as React from 'react';

import PresentNodes from './nodes/PresentNodes';
import SlideControlPlugin from './plugins/SlideControlPlugin';
import ToolbarPlugin2 from './plugins/ToolbarPlugin2';
import TreeViewPlugin from './plugins/TreeViewPlugin/index';
import PlaygroundEditorTheme from './themes/PlaygroundEditorTheme';

const initialConfig = {
  // editorState: ,
  namespace: 'Playground',
  nodes: [...PresentNodes],
  onError: (error: Error) => {
    throw error;
  },
  theme: PlaygroundEditorTheme,
};

const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});
// @ts-ignore
window.__DEBUG__ = !!params.debug;

function App() {
  return (
    <div className="App">
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin2 />
        <PlainTextPlugin
          contentEditable={<ContentEditable />}
          placeholder={<></>}
        />
        <SlideControlPlugin />
        {/* @ts-ignore */}
        {window.__DEBUG__ && <TreeViewPlugin />}
      </LexicalComposer>
    </div>
  );
}

export default App;
