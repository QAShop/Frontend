
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppContent } from './AppContent';
import ProductPage from './ProductPage';
import CreateProductPage from './views/CreateProductPage';
import EditProductPage from './views/EditProductPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppContent />} />
        <Route path="/products/:productId" element={<ProductPage />} />
        <Route path="/create-product" element={<CreateProductPage />} />
        <Route path="/edit-product/:productId" element={<EditProductPage />} />
      </Routes>
    </Router>
  );
}

export default App;


