// App.tsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Loading from './assets/asshtml/Loding';
const LazyRoutes = lazy(() => import('./routers/index'));

function App() {
  return (
    <Suspense fallback={<><Loading /></>}>
      <Router>
        <Routes>
          <Route path="*" element={<LazyRoutes />} />
        </Routes>
      </Router>
    </Suspense>
  );
}

export default App;
