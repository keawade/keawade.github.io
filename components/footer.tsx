import Container from "./container";

const Footer = () => {
  return (
    <footer className="bg-neutral-50 border-t border-neutral-200">
      <Container>
        <div className="py-28 flex flex-col lg:flex-row items-center">
          <h3 className="text-xl tracking-tighter leading-tight">
            Isn&apos;t it enough to see that a garden is beautiful without
            having to believe that there are fairies at the bottom of it too?
          </h3>
          <div className="flex flex-col lg:flex-row"></div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
