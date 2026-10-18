import { Outlet } from "react-router";
import Navbar from "./Navbar";

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container py-4">
        <Outlet />
      </main>
    </>
  );
}
