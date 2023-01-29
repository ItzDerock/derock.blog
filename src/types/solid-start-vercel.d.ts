declare module 'solid-start-vercel' {
  import { Adapter } from 'solid-start/vite/plugin';
  export default function vercel(opts: {
    prerender?: boolean | {
      expiration?: number;
      bypassToken?: string;
    };
  }): Adapter;
}
