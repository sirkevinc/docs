import React, { useState, useRef, useEffect } from 'react';
import { Editor } from 'slate-react';
import { Value } from 'slate';
import { initialValue } from './slateinitialValue';
import Top from './Top';

import io from 'socket.io-client';

const socket = io('http://localhost:8000');


const SyncingEditor = ({ groupId }) => {
  const [value, setValue] = useState(initialValue);
  const id = useRef(`${Date.now()}`)
  const editor = useRef(null);
  const remote = useRef(false);

  useEffect(() => {
    // socket.once('init-value', (value) => {
    //   setValue(Value.fromJSON(value))
    // });

    // // socket.emit('send-value');
    fetch(`http://localhost:8000/groups/${groupId}`).then(x => 
      x.json().then(data => {
        setValue(Value.fromJSON(data));
      })
    );

    const eventName = `new-remote-operations-${groupId}`;

    socket.on(
      `new-remote-operations-${groupId}`, 
      ({editorId, ops}) => {
        if (id.current !== editorId) {
          remote.current = true;
          ops.forEach(op => 
            editor.current.applyOperation(op)
          );
          remote.current = false;
        }
      }
    );

    return () => {
      socket.off(eventName);
    };
  }, [])

  return (
    <>
    <Top />
      <button
        onMouseDown={(e)=> {
          e.preventDefault();
          // bold selected text
          editor.current.toggleMark('bold');
        }}
      >
        Bold
      </button>
      <button
        onMouseDown={(e)=> {
          e.preventDefault();
          // italicize selected text
          editor.current.toggleMark('italic');
        }}
      >
        Italic
      </button>
    <Editor
      ref={editor}
      style={{
        backgroundColor: '#fafafa',
        maxWidth: 800,
        minHeight: 150
      }}
      value={value}
      renderMark={(props, _editor, next) => {
        if (props.mark.type === 'bold') {
          return <strong style={{
            letterSpacing: 1,
          }}>{props.children}</strong>
        } else if (props.mark.type === 'italic') {
          return <em>{props.children}</em>
        }

        return next();
      }}
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
          socket.emit('new-operations', {
            editorId: id.current, 
            ops,
            value: opts.value.toJSON(),
            groupId
          });
        }
      }} 
    />
    </>
  );
};

export default SyncingEditor;