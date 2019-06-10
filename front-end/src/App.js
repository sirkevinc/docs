import React from 'react';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import SyncingEditor from './SyncingEditor';
import GroupEditor from './GroupEditor';

const App = () => {
  return (
    <BrowserRouter>
      <Route 
        path="/"
        exact
        render={() => {
          return <Redirect to={`/group/${Date.now()}`} />;
        }}
      />
      <Route path='/group/:id/' component={GroupEditor} />
      <div>
        <SyncingEditor />
        <br />
        <SyncingEditor />
      </div>
    </BrowserRouter>
  )
}

export default App;