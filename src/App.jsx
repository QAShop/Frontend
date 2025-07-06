
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppContent } from './AppContent';
import ProductPage from './ProductPage';
import CreateProductPage from './views/CreateProductPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppContent />} />
        <Route path="/products/:productId" element={<ProductPage />} />
        <Route path="/create-product" element={<CreateProductPage />} />
      </Routes>
    </Router>
  );
}

export default App;


