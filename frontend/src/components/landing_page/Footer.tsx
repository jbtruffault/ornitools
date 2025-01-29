import { LogoIcon } from "./Icons";

export const Footer = () => {
  return (
    <footer id="footer">
      <hr className="w-11/12 mx-auto" />

      <section className="container py-20 grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-12 gap-y-8">
        <div className="col-span-full xl:col-span-2">
          <a
            rel="noreferrer noopener"
            href="/"
            className="font-bold text-xl flex"
          >
            <LogoIcon />
            Ornitools
          </a>
        </div>
      </section>

      <section className="container pb-14 text-center">
        <h3>
          &copy; 2024 {" "}
          <a
            rel="noreferrer noopener"
            target="_blank"
            href="https://www.linkedin.com/in/jbtruffault/"
            className="text-primary transition-all border-primary hover:border-b-2"
          >
            Jean-Baptiste Truffault
          </a>
        </h3>
      </section>
    </footer>
  );
};
