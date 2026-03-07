import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { TeamProvider } from './context/TeamContext';
import { VentureProvider } from './context/VentureContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import VendorProfile from './pages/VendorProfile';
import TeamWorkspace from './pages/TeamWorkspace';
import VentureWorkspace from './pages/VentureWorkspace';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <TeamProvider>
            <VentureProvider>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/vendor/:id" element={<VendorProfile />} />
                    <Route path="/team/:id" element={<TeamWorkspace />} />
                    <Route path="/venture/:id" element={<VentureWorkspace />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </VentureProvider>
          </TeamProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
