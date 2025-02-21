"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const path = usePathname();

  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link
              href={"/"}
              style={{
                color:
                  path === "/" ? "var(--fifth-color)" : "var(--third-color)",
              }}
            >
              Home
            </Link>
          </li>
          <li>
            <Image src={"/logo.png"} alt="logo" width={100} height={100} />
          </li>
          <li>
            <Link
              href={"/files"}
              style={{
                color:
                  path === "/files"
                    ? "var(--fifth-color)"
                    : "var(--third-color)",
              }}
            >
              Files
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
