const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const cors = require('cors');

// let value = {
//   document: {
//     nodes: [
//       {
//         object: 'block',
//         type: 'paragraph',
//         nodes: [
//           {
//             object: 'text',
//             text: 'A line of text in a paragraph.',
//           },
//         ],
//       },
//     ],
//   },
// };

let initialEditorValue = {
  document: {
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        nodes: [
          {
            object: 'text',
            text: 'A line of text in a paragraph.',
          },
        ],
      },
    ],
  },
};

const groupData = {};

io.on('connection', (socket) => {
  socket.on('new-operations', (data) => {
    groupData[data.groupId] = data.value;
    io.emit(`new-remote-operations-${data.groupId}`, data)
  });
});

app.use(cors({
  origin: 'http://localhost:3000',
}));

app.get('/groups/:id', (req, res) => {
  const {id} = req.params;
  if (id in groupData) {
    res.send(groupData[id]);
  } else {
    groupData[id] = initialEditorValue;
    res.send(initialEditorValue);
  }
});

http.listen(8000, () => {
  console.log('listening on 8000')
});