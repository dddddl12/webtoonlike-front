import React from "react";
import { Container } from "@/ui/layouts";
import { WebtooonFeedList } from "./WebtoonFeedList";


export function BuyerHomePage(): JSX.Element {
  return (
    <Container>
      <h1>Buyer Home Page</h1>

      <WebtooonFeedList />
    </Container>
  );
}