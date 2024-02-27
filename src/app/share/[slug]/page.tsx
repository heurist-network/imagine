import { redirect } from "next/navigation";
import Link from "next/link";

export default function Share() {
  // redirect("/");

  return (
    <div className="container">
      <Link href="/">Redirect to Index</Link>
    </div>
  );
}
