"use client";
import { useEffect } from "react";
import style from "./nav.module.scss";
import Image from "next/image";
import Link from 'next/link';

import { ConnectButton } from '@rainbow-me/rainbowkit';

function TopNav() {
  useEffect(() => {
  }, []);
  return (
    <div className={style.root}>
      <nav>
        <div className="top_nav_left_section">
          <div className="logo_text"><Link href="/">Imagine</Link></div>
          <Link href="https://discord.gg/Ch6Y7mYMdr" target="_blank">
            <Image src='/discord.svg' width='25' height='19' alt='Discord Mark' />
          </Link>
          <Link href="https://twitter.com/heurist_ai" target="_blank">
            <Image src='/x.svg' width='20' height='25' alt='Discord Mark' />
          </Link>
          <Link href="https://github.com/heurist-network" target="_blank">
            <Image src='/github.svg' width='22' height='22' alt='Discord Mark' />
          </Link>
        </div>
        <div>
          <ConnectButton />

        </div>
      </nav>
    </div>
  )
}
export default TopNav