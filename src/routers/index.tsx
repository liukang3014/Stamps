// routers.tsx
import { Route, Routes } from "react-router-dom";

import {
  Users,
  Layout,
  Home
} from "./routers"


const Router = () => {
  return (
    <Routes>
      <Route path="/Users" element={<Users />} />
      <Route path="/Layout" element={<Layout />} />
      <Route path="/" element={<Home />} />
    </Routes>
  );
};

export default Router;

