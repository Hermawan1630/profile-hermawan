
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ProfileDataProvider } from './contexts/ProfileDataContext';
import { ThemeProvider } from './contexts/ThemeContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Determine basename for BrowserRouter
// Vercel and most custom domains host at the root ("/").
// GitHub Pages hosts at "/repository-name/" if it's not a user/org page.
// If deploying to GitHub Pages in a subdirectory (e.g., username.github.io/my-repo/),
// you MUST set basename to "/my-repo".
// For example: const basename = "/my-repo";
// Otherwise, for Vercel or root deployments, "/" is correct.
const basename = "/"; // Default for Vercel and root deployments.

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <ThemeProvider>
        <ProfileDataProvider>
          <App />
        </ProfileDataProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);