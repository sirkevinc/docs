import React from 'react';
import SyncingEditor from './SyncingEditor';

// import { Editor } from 'slate-react'

// const initialValue = Value.fromJSON({
//   document: {
//     nodes: [
//       {
//         object: 'block',
//         type: 'paragraph',
//         nodes: [
//           {
//             object: 'text',
//             leaves: [
//               {
//                 text: 'A line of text in a paragraph.',
//               },
//             ],
//           },
//         ],
//       },
//     ],
//   },
// })

const App = () => {
  return (
    <div>
      <SyncingEditor />
      <br />
      <SyncingEditor />
    </div>
  )
}

export default App;