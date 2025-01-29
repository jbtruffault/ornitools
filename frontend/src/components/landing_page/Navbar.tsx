'use client';

import { useState, useEffect } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from '@/components/auth-provider';
import { buttonVariants } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogoIcon } from "./Icons";

interface RouteProps {
  href: string;
  label: string;
}

const routeList: RouteProps[] = [
  {
    href: "#route_map",
    label: "Carte",
  },
  {
    href: "#about",
    label: "Programme",
  },
  {
    href: "#sponsors",
    label: "Partenaires",
  },

];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  useEffect(() => {
    setIsOpen(false);
  }, []);

  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Utiliser useEffect pour détecter si l'écran est "mobile"
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // Définir comme "mobile" si la largeur est < 768px
    };

    checkScreenSize(); // Définir la taille au chargement
    window.addEventListener("resize", checkScreenSize); // Mettre à jour sur redimensionnement

    return () => {
      window.removeEventListener("resize", checkScreenSize); // Nettoyage de l'écouteur
    };
  }, []);

  const { user, isLoading } = useAuth();

  return (
    <header className="sticky border-b-[1px] top-0 z-40 w-full bg-white dark:border-b-slate-700 dark:bg-background">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container h-14 px-4 w-screen flex justify-between ">
          <NavigationMenuItem className="font-bold flex">
            <a
              rel="noreferrer noopener"
              href="/"
              className="ml-2 font-bold text-xl flex"
            >
              <LogoIcon />
              Ornitools
            </a>
          </NavigationMenuItem>

          {isMobile ? (
            // Affichage pour les mobiles
            <span className="flex md:hidden">
              <ThemeToggle />

              <Sheet>
                <SheetTrigger className="px-2">
                  <Menu className="flex h-5 w-5">
                    <span className="sr-only">Menu Icon</span>
                  </Menu>
                </SheetTrigger>

                <SheetContent side={"left"}>
                  <SheetHeader>
                    <SheetTitle className="font-bold text-xl">
                      Ornitools
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col justify-center items-center gap-2 mt-4">
                    {routeList.map(({ href, label }: RouteProps) => (
                      <a
                        rel="noreferrer noopener"
                        key={label}
                        href={href}
                        className={buttonVariants({ variant: "ghost" })}
                      >
                        {label}
                      </a>
                    ))}
                    {user && (
                    <>
                      <span className="border-t border-gray-300 w-full my-2"></span>
                      <a
                        rel="noreferrer noopener"
                        href="/dashboard"
                        className={buttonVariants({ variant: "ghost" })}
                      >
                        Accueil
                      </a>
                      <a
                      rel="noreferrer noopener"
                      href="/bird"
                      className={buttonVariants({ variant: "ghost" })}
                      >
                      Oiseaux
                      </a>
                    </>
                    )}
                    {user ? (
                      <a
                        rel="noreferrer noopener"
                        href="/logout"
                        className={`w-[110px] border ${buttonVariants({
                          variant: "outline",
                        })}`}
                      >
                        Déconnexion
                      </a>
                    ) : (
                      <a
                        rel="noreferrer noopener"
                        href="/login"
                        className={`w-[110px] border ${buttonVariants({
                          variant: "outline",
                        })}`}
                      >
                        Connexion
                      </a>
                    )}
                  </nav>
                </SheetContent>
              </Sheet>
            </span>
          ) : (
            // Affichage pour les écrans larges
            <>
              <nav className="hidden md:flex gap-2">
                {routeList.map((route: RouteProps, i) => (
                  <a
                    rel="noreferrer noopener"
                    href={route.href}
                    key={i}
                    className={`text-[17px] ${buttonVariants({
                      variant: "ghost",
                    })}`}
                  >
                    {route.label}
                  </a>
                ))}
                {user && (
                    <>
                      <span className="border-l border-gray-300 h-6 mx-2 self-center"></span>
                      <a
                        rel="noreferrer noopener"
                        href="/dashboard"
                        className={buttonVariants({ variant: "ghost" })}
                      >
                        Accueil
                      </a>
                      <a
                      rel="noreferrer noopener"
                      href="/bird"
                      className={buttonVariants({ variant: "ghost" })}
                      >
                      Oiseaux
                      </a>
                    </>
                    )}
              </nav>

              <div className="hidden md:flex gap-2">
              {user ? (
                      <a
                        rel="noreferrer noopener"
                        href="/logout"
                        className={`w-[110px] border ${buttonVariants({
                          variant: "outline",
                        })}`}
                      >
                        Déconnexion
                      </a>
                    ) : (
                      <a
                        rel="noreferrer noopener"
                        href="/login"
                        className={`w-[110px] border ${buttonVariants({
                          variant: "outline",
                        })}`}
                      >
                        Connexion
                      </a>
                    )}


                <ThemeToggle />
              </div>
            </>
          )}
        </NavigationMenuList>
      </NavigationMenu>
    </header>

  );
};
