import React, { useState, useRef, useEffect } from 'react';
import { Editor } from 'slate-react';
import { initialValue } from './slateinitialValue';

import io from 'socket.io-client';

const socket = io('http://localhost:8000');


const SyncingEditor = () => {
  const [value, setValue] = useState(initialValue);
  const id = useRef(`${Date.now()}`)
  const editor = useRef(null);
  const remote = useRef(false);

  useEffect(() => {
    socket.on(
      'new-remote-operations', 
      ({editorId, ops}) => {
        if (id.current !== editorId) {
          remote.current = true;
          JSON.parse(ops).forEach(op => 
            editor.current.applyOperation(op)
          );
          remote.current = false;
        }
    });
  }, [])

  return (
    <Editor
      ref={editor}
      style={{
        backgroundColor: '#fafafa',
        maxWidth: 800,
        minHeight: 150
      }}
      value={value}
      onChange={opts => {
        setValue(opts.value);

        const ops = opts.operations
          .filter(o => {
            if (o) {
              return (
                o.type !== 'set_selection' &&
                o.type !== 'set_value' &&
                (!o.data || !o.data.has('source'))
              );
            }
            return false;
          })
          .toJS()
          .map(o => ({ ...o, data: { source: 'one' }}));
        if (ops.length && !remote.current) {
          socket.emit('new-operations', 
          {editorId: id.current, ops: JSON.stringify(ops)});
        }
      }} 
    />
  );
};

export default SyncingEditor;