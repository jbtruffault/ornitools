import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { HeroCards } from "./HeroCards";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

export const Hero = () => {
  return (
    <section className="container grid lg:grid-cols-2 place-items-center py-20 md:py-32 gap-10">
      <div className="text-center lg:text-start space-y-6">
        <main className="text-5xl md:text-6xl font-bold">
          
          <h2 className="inline">
            Programme de suivi
          </h2>{" "}
          des{" "}
          <h1 className="inline">
            <span className="inline bg-gradient-to-r from-[#35211C] via-[#AB8F70] to-[#79543F] text-transparent bg-clip-text">
              œdicnèmes criards
            </span>{" "}
          </h1>{" "}
        </main>

        <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
          Projet mené par Uéline COURCOUX-CARO <br/>
          Chargée d&apos;études ornithologiques au Conservatoire d&apos;espaces naturels de Normandie
        </p>

        <div className="space-y-4 md:space-y-0 md:space-x-4">
          <Button className="w-full md:w-1/3">Carte</Button>
        </div>
      </div>

      {/* Hero cards sections */}
      <div className="z-10">
        <HeroCards />
      </div>

      {/* Shadow effect */}
      <div className="shadow"></div>
    </section>
  );
};
