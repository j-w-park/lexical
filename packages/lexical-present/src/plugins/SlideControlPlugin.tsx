/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {$getRoot} from 'lexical';
import {useEffect} from 'react';

let slide = 0;

export default function SlideControlPlugin(): null {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    function moveToSlide() {
      // eslint-disable-next-line no-console
      console.info(`-- Move to slide ${slide} --`);
      // Patch for the key event that we can't prevent for some reason
      setTimeout(() => {
        editor.update(() => {
          const root = $getRoot();
          let count = -1;
          const children = root.getChildren();
          for (let i = 0; i < children.length; i++) {
            const node = children[i];
            // instanceof ??
            if (node.__type === 'slide') {
              count++;
              if (count === slide) {
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
          slide--;
          moveToSlide();
          e.preventDefault();
        } else {
          if (e.key === 'ArrowRight') {
            slide++;
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
  return null;
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
