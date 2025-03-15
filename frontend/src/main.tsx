import React, { useEffect, useContext } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Playground from './pages/Playground'
import Agents from './pages/Agents'
import PlaygroundHistory from './pages/Playground-history'
import './index.css'
import { UserProvider, UserContext, getUserInfo } from './contexts/UserContext'

function App() {
  const [isLoading, setIsLoading] = React.useState(true);
  const { setUserInfo } = useContext(UserContext);

  useEffect(() => {
    async function loadUser() {
      const user = await getUserInfo();
      setUserInfo(user);
      setIsLoading(false);
    }
    loadUser();
  }, []);

  if (isLoading) {
    return <div>Loading user info...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<Playground />} />
      <Route path="/agents" element={<Agents />} />
      <Route path="/playground-history" element={<PlaygroundHistory />} />
    </Routes>
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <UserProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </UserProvider>
  </React.StrictMode>
)