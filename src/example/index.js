import React from 'react';
import App from './index.jsx';
import { createRoot } from 'react-dom/client';

// 使用 createRoot 替代 ReactDOM.render
createRoot(document.getElementById('root')).render(<App />);