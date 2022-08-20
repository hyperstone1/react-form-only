import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Authorization from './components/Authorization';
import Register from './components/Register';
import Profile from './components/Profile';
import './scss/index.scss';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/login" element={<Authorization />} />
      <Route path="register" element={<Register />} />
    </Routes>
  );
}

export default App;
