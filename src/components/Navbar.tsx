import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  return (
    <header>
      <nav>
        <Link href="/" className="logo">
          <Image
            src="/icons/logo.png"
            alt="Dev Events Logo"
            width={24}
            height={24}
          />
          <p>Dev Events</p>
        </Link>

        <ul className="nav-links">
          <Link href="/home">Home</Link>
          <Link href="/events">Events</Link>
          <Link href="/createevents">Create Events</Link>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
