import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    // Vérifie que window est disponible (par ex. pas en mode SSR)
    if (typeof window !== "undefined") {
      const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

      const onChange = () => {
        setIsMobile(mql.matches); // Utilise directement mql.matches pour refléter l'état
      };

      mql.addEventListener("change", onChange);
      setIsMobile(mql.matches); // Initialise avec l'état actuel

      return () => {
        mql.removeEventListener("change", onChange);
      };
    } else {
      // Pour le SSR, on peut retourner une valeur par défaut
      setIsMobile(undefined);
    }
  }, []);

  return !!isMobile;
}
