import { useState } from 'react';

function TestComponent() {
  const [count, setCount] = useState(0);
  
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>React Test Component</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <p>If this works, React hooks are functioning correctly!</p>
    </div>
  );
}

export default TestComponent;



