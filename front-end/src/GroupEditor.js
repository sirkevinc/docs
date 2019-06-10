import React from 'react';
import SyncingEditor from './SyncingEditor';

const GroupEditor = ({ match }) => {
  return (
    <div>
      <SyncingEditor groupId={match.params.id} />
    </div>
  )
}

export default GroupEditor;