import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('renders the app shell without crashing', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  const appContainer = document.querySelector('.App');
  expect(appContainer).toBeInTheDocument();
});
