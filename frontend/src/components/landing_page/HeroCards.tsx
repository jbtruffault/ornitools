import Image from "next/image";
import oedicneme_chatgpt from "@/app/img/oedicneme_chatgpt_nobg.png";

export const HeroCards = () => {
  return (
    <div className="hidden lg:flex flex-row flex-wrap gap-8 relative ">
      <Image
            src={oedicneme_chatgpt}
            alt="Pilot"
            width={500}
            height={500}
            className="object-contain rounded-3xl"
          />
    </div>
  );
};
