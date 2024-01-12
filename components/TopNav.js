"use client";
import { useState, useEffect } from "react";
import style from "./nav.module.scss";
import Image from "next/image";

import Link from 'next/link';
function TopNav() {
  const [data, setData] = useState("data TopNav");
  useEffect(() => {
  }, []);
  return (
    <div className={style.root}>
      <nav>
        <div className="top_nav_left_section">
          <div className="logo_text"><Link href="/">Heurist</Link></div>
          <Link href="https://discord.gg/ndqSSjkd">
            <Image src='/discord-mark-white.png' width='25' height='19' alt='Discord Mark' />
          </Link>
        </div>
      </nav>
    </div>
  )
}
export default TopNav