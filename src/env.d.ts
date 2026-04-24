/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly ADMIN_USER: string;
  readonly ADMIN_PASS: string;
  readonly PROJECTS_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace App {
  interface Locals {}
}
