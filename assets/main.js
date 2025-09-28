import 'uno.css';

import { createRoot } from 'react-dom/client';
import App from './react/App.jsx';
import { BrowserRouter } from 'react-router-dom';
// Bootstrap Bundle JS
import 'bootstrap/dist/js/bootstrap.bundle.min';

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
