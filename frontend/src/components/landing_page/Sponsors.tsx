import Image, { StaticImageData } from "next/image";
import UE from "@/app/img/UE.png";
import CENN from "@/app/img/CENN.png";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MedalIcon, MapIcon, PlaneIcon, GiftIcon } from "@/components/landing_page/Icons";

interface SponsorProps {
  logo: StaticImageData;
  name: string;
  description: string;
}

const sponsors: SponsorProps[] = [
  {
    logo: CENN,
    name: "CENN",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque lacinia elementum est suscipit sagittis. Nunc finibus risus eget erat efficitur efficitur. Curabitur at nunc placerat, viverra velit in, posuere diam. Proin id laoreet erat.",
  },
  {
    logo: UE,
    name: "UE",
    description: "Nullam eu ipsum at metus tempus feugiat non a magna. Pellentesque ultrices nec justo sit amet aliquet. Etiam tincidunt odio vitae justo gravida tempus nec ac magna. Proin dignissim fermentum diam vitae dapibus. Nam ac finibus tellus. ",
  },
];

export const Sponsors = () => {
  return (
    <section
      id="sponsors"
      className="container pt-24 sm:py-32"
    >
      <h2 className="text-center text-md lg:text-xl font-bold mb-8 text-primary">
        Partenaires
      </h2>

      <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
        {sponsors.map(({ logo, name, description }: SponsorProps) => (
          <div
            key={name}
            className="flex items-center gap-1 text-muted-foreground/60"
          >
            <Image
              src={logo}
              alt={name}
              width={150}
              height={150}
              className="object-contain rounded-none"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export const Sponsors2 = () => {
  return (
    <section
      id="sponsors"
      className="container text-center py-24 sm:py-32"
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-8">
        Partenaires
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 ">
        {sponsors.map(({ logo, name, description }: SponsorProps, index: number) => (
          <Card
            key={name}
            className={`bg-muted/50 flex flex-col justify-center items-center max-w-xs w-full ${sponsors.length === 2 ? (index === 0 ? 'lg:col-start-2' : 'lg:col-start-3') : ''}`}
          >
            <CardHeader className="flex flex-col items-center">
              <CardTitle className="grid gap-4 place-items-center">
                <Image
                  src={logo}
                  alt={name}
                  width={200}
                  className="object-contain rounded-none"
                />
                {/*<p className="md:w-3/4 mx-auto mt-1 text-xl text-muted-foreground">{name}</p>*/}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">{description}</CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
