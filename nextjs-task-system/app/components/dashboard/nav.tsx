import NavDropdown from "./nav-dropdown";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-xl font-bold">Task Manager</div>
        <NavDropdown />
      </div>
    </nav>
  );
}
