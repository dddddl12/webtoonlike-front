import { Col, Gap } from "@/ui/layouts";
import { NavBar } from "./NavBar";
import { LogoSection } from "./LogoSection";

export function Header() {
  return (
    <section
      id='navbar'
      className='sticky top-0 w-full flex flex-row items-end justify-around bg-black shadow-md z-50'
    >
      <Col className="w-[1280px] items-center">
        <LogoSection />
        <Gap y="10px" />
        <NavBar />
      </Col>
    </section>
  );
}
