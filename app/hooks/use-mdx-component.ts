import { useMemo } from "react";
import { getMDXComponent } from "mdx-bundler/client/index.js";

export function useMdxComponent(code: string) {
  return useMemo(() => getMDXComponent(code), [code]);
}
