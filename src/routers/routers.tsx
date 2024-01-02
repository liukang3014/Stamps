import { lazy } from 'react'


export const Users = lazy(() => import("../view/Users/Users"));
export const Layout = lazy(() => import("../view/Layout/Layout"));
export const Home = lazy(() => import("../view/Home/Home"));