import { Container, Row } from "@/ui/layouts";
import { AdminProtector } from "./AdminProtector";
import { AdminSheet } from "@/components/AdminSheet";
import { AdminRouter } from "./router";

export function AdminPage(): JSX.Element {

  return (
    <Container className="bg-white max-w-[100%] md:pt-0">
      <Container className="md:pt-0">
        <AdminProtector>
          <Row className="items-start">
            <AdminSheet />
            <AdminRouter/>
          </Row>
        </AdminProtector>
      </Container>
    </Container>
  );
}