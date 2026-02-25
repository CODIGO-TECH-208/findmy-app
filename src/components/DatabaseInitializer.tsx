import { useEffect } from "react";
import { useDatabaseStore } from "@/stores/databaseStore";

export function DatabaseInitializer({ children }: { children: React.ReactNode }) {
  const initialize = useDatabaseStore((s) => s.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return <>{children}</>;
}
