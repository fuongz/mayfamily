import { Home } from "@/components/features/home";
import { URL } from "@/config/url";

export default async function HomePage() {
  const res = await fetch(URL.CDN_URL + "/home.json");
  const images = await res.json();

  return <Home images={images} />;
}
