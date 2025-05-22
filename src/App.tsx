import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'sonner';
import AppRoutes from './routes/AppRoutes';
import { store } from './store';
import './styles/kendoTheme.scss';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppRoutes />
        <Toaster position="top-right" richColors closeButton />
      </Router>
    </Provider>
  );
}

export default App;