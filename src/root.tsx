// @refresh reload
import { createEffect, Show, Suspense } from "solid-js";
import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Link,
  Meta,
  Routes,
  Scripts,
  Title,
  useIsRouting,
} from "solid-start";
import { HttpStatusCode } from "solid-start/server";
import Navbar from "./partials/Navbar";
import "./root.css";
import NotFound from "./routes/[...404]";
import "nprogress/nprogress.css";
import nProgress from "nprogress";
import { IoGitBranch } from "solid-icons/io";

export default function Root() {
  const isRouting = useIsRouting();

  createEffect(() => {
    if (isRouting()) {
      nProgress.start();
    } else {
      nProgress.done();
    }
  });

  return (
    <Html lang="en" class="text-white bg-gradient-to-tr from-[#190729] to-[#030105] min-h-screen ">
      <Head>
        <Title>Derock | Blog</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta name="theme-color" content="#190729" />
        <Meta name="description" content="Derock's cool blog website with lots of developer related content." />

        {/* fonts */}
        <Link rel="preconnect" href="https://fonts.bunny.net" />
        <Link href="https://fonts.bunny.net/css?family=ibm-plex-mobo:500|roboto:500" rel="stylesheet" />
      </Head>
      <Body class="max-w-6xl mx-auto">
        <Suspense>
          <ErrorBoundary>
            <Navbar />

            {/* 404 fallback */}
            <ErrorBoundary
              fallback={error => (
                <Show
                  fallback={
                    <>
                      <HttpStatusCode code={500} />
                      <h1>500 - Internal Server Error</h1>
                      <p>{error.message}</p>
                    </>
                  }
                  when={error.message.startsWith("404")}>
                  <HttpStatusCode code={404} />
                  <NotFound />
                </Show>
              )}
            >
              {/* routes */}
              <Suspense fallback={<p>Loading</p>}>
                <Routes>
                  <FileRoutes />
                </Routes>
              </Suspense>
            </ErrorBoundary>

            {/* footer */}
            <a
              class="text-center mx-auto my-4 block"
              href="https://github.com/ItzDerock/derock.blog"
            >
              <IoGitBranch class="inline-block mr-1" />

              Version {
                import.meta.env.VITE_COMMIT_HASH?.slice(0, 7)
                ?? "unknown"
              }
            </a>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  );
}
