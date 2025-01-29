import { Statistics } from "./Statistics";
import oedicneme_prog_nat from "@/app/img/oedicneme_prog_nat.webp";
import Image from "next/image";

export const About = () => {
  return (
    <section
      id="about"
      className="container py-24 sm:py-32"
    >
      <div className="bg-muted/50 border rounded-lg py-12">
        <div className="px-6 flex flex-col-reverse md:flex-row gap-8 md:gap-12">
          <Image
            src={oedicneme_prog_nat}
            alt="oedicneme_prog_nat"
            width={300}
            height={300}
            className="object-contain rounded-full"
          />
          <div className="bg-green-0 flex flex-col justify-between">
            <div className="pb-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Description du programme
              </h2>
              <p className="text-xl text-muted-foreground mt-4">
              Au niveau national, un programme de suivi de reproduction de l&apos;Œdicnème criard a démarré depuis 2020. En Normandie, le
              Conservatoire d&apos;espaces naturels de Normandie participe à ce programme en Seine-Maritime et dans l&apos;Eure le long des boucles
              de la Seine. Les objectifs sont de mieux comprendre les aspects démographiques, écologiques ou éco toxicologiques de cette
              espèce emblématique des milieux steppiques afin de mieux la protéger
              </p>
            </div>

            <Statistics />
          </div>
        </div>
      </div>
    </section>
  );
};
