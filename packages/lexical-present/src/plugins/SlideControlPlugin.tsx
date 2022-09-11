/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {$getRoot, $nodesOfType} from 'lexical';
import {useEffect, useState} from 'react';
import * as React from 'react';

import {SlideNode} from '../nodes/SlideNode';

let slide = 0;

function useKeyboardNavigation() {
  const [editor] = useLexicalComposerContext();
  const [count, setCount] = useState(0);
  const [selected, setSelected] = useState(0);
  useEffect(() => {
    let currentCount = 0;
    editor.getEditorState().read(() => {
      currentCount = $nodesOfType(SlideNode).length;
      setCount(currentCount);
    });
    return editor.registerMutationListener(SlideNode, (entries) => {
      for (const entry of entries) {
        if (entry[1] === 'created') {
          currentCount++;
          setCount(currentCount);
        } else if (entry[1] === 'destroyed') {
          currentCount--;
          setCount(currentCount);
        }
      }
    });
  }, [editor]);
  useEffect(() => {
    function moveToSlide() {
      // eslint-disable-next-line no-console
      console.info(`-- Move to slide ${slide} --`);
      // Patch for the key event that we can't prevent for some reason
      setTimeout(() => {
        editor.update(() => {
          const root = $getRoot();
          let j = -1;
          const children = root.getChildren();
          for (let i = 0; i < children.length; i++) {
            const node = children[i];
            // instanceof ??
            if (node.__type === 'slide') {
              j++;
              if (j === slide) {
                const domElement = editor.getElementByKey(node.getKey());
                if (domElement !== null) {
                  domElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                  });
                }
              }
            }
          }
        });
      }, 200);
    }
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'ArrowLeft') {
          setSelected(--slide);
          moveToSlide();
          e.preventDefault();
        } else {
          if (e.key === 'ArrowRight') {
            setSelected(++slide);
            moveToSlide();
            e.preventDefault();
          }
        }
      }
    };
    document.addEventListener('keydown', handler);
    return () => {
      document.removeEventListener('keydown', handler);
    };
  });
  return [count, selected];
}

function TOC({
  count,
  selected,
}: {
  count: number;
  selected: number;
}): JSX.Element {
  console.info(count, selected);
  return (
    <div className="toc">
      <ul>
        {Array(count)
          .fill(0)
          .map((v, i) => (
            <li
              key={i}
              className={`toc__li ${i === selected ? 'toc__li-selected' : ''}`}
            />
          ))}
      </ul>
    </div>
  );
}

export default function SlideControlPlugin(): JSX.Element {
  const [count, selected] = useKeyboardNavigation();
  return <TOC count={count} selected={selected} />;
}

// export default function SlideControlPlugin(): null {
//   const [editor] = useLexicalComposerContext();
//   useEffect(() => {
//     function moveToSlide() {
//       // eslint-disable-next-line no-console
//       console.info(`-- Move to slide ${slide} --`);
//       // Patch for the key event that we can't prevent for some reason
//       setTimeout(() => {
//         editor.update(() => {
//           const root = $getRoot();
//           let count = -1;
//           const children = root.getChildren();
//           for (let i = 0; i < children.length; i++) {
//             const node = children[i];
//             // instanceof ??
//             if (node.__type === 'slide') {
//               count++;
//               if (count === slide) {
//                 const domElement = editor.getElementByKey(node.getKey());
//                 console.info(node.getKey());
//                 if (domElement !== null) {
//                   domElement.scrollIntoView({
//                     behavior: 'smooth',
//                     block: 'start',
//                   });
//                 }
//               }
//             }
//           }
//         });
//       }, 200);
//     }
//     return mergeRegister(
//       editor.registerCommand(
//         KEY_MODIFIER_COMMAND,
//         (e) => {
//           const key = e.key;
//           if (key === 'ArrowLeft') {
//             slide--;
//             moveToSlide();
//             return true;
//           } else if (key === 'ArrowRight') {
//             slide++;
//             moveToSlide();
//             return true;
//           }
//           return false;
//         },
//         COMMAND_PRIORITY_CRITICAL,
//       ),
//     );
//   }, [editor]);
//   return null;
// }
