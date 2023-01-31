import { A } from "solid-start";

export default function NotFound() {
  return (
    <main class="text-center mx-auto text-gray-400 p-4">
      <img src="https://http.cat/404" alt="404" class="mx-auto" />
      <p class="mt-8">
        The page you're looking for doesn't exist. Maybe it did exist, but it
        sure is gone now.
      </p>
      <p class="my-4">
        <A href="/" class="text-sky-600 hover:underline">
          Back home
        </A>
      </p>
    </main>
  );
}
