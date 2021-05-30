import * as React from 'react';

export const App = () => {
  const [count, setCount] = React.useState(0);
  return (
    <div>
      <h1>
        Count:
        {count}
      </h1>
      <button type="button" onClick={() => setCount(count + 1)}>Increase!</button>
    </div>
  );
};

App.displayName = 'App';
