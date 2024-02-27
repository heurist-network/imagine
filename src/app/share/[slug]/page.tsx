import { redirect } from "next/navigation";

export default function Share() {
  redirect("/");

  return <div className="container">Redirect...</div>;
}
