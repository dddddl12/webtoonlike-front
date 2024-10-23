"use client";
import React from "react";
import { useParams } from "next/navigation";

import { ManageBidRoundRequestTab } from "./tabs/ManageBidRoundRequestTab";
import { ManageBidRoundTab } from "./tabs/ManageBidRoundTab";
import { ManageUserTab } from "./tabs/ManageUserTab";
import { Dashboard } from "./tabs/Dashboard";
import { ManageAdmin } from "./tabs/ManageAdmin";
import { Container } from "@/ui/layouts";
import { Invoice } from "./tabs/Invoice";
import { ManageGenre } from "./tabs/ManageGenre";
import { ManageSubmitTab } from "./ManageSubmitTab";


const tabComponents: { [key: string]: JSX.Element } = {
  "dashboard": <Dashboard/>,
  "manage-user": <ManageUserTab/>,
  "manage-admin": <ManageAdmin/>,
  "manage-manuscript": <ManageBidRoundTab />,
  "manage-submit": <ManageSubmitTab />,
  "manage-offer": <ManageBidRoundRequestTab/>,
  "manage-invoice": <Invoice/>,
  "manage-genre": <ManageGenre/>,
};

export function AdminRouter() {
  const param = useParams();

  const tab = tabComponents[param.tab as string];
  return tab
    ? <Container className="bg-gray-light">{tab}</Container>
    : <div>no tab matching</div>;
}