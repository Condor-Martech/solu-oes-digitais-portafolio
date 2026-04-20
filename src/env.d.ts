/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly AUTH_SECRET: string;
  readonly SYNC_SECRET: string;
  readonly DATA_FILE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace App {
  interface Locals {}
}
