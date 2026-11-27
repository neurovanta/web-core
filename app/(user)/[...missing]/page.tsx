import { notFound } from "next/navigation";

// Any URL no route matches lands here and renders app/(user)/not-found.tsx inside the
// site layout (header, footer). Needed because the app has two root layouts
// ((user) and (admin)) and therefore no app/layout.tsx to host a global 404.
export default function CatchAllNotFound() {
  notFound();
}
