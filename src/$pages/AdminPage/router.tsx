"use client";
import React from "react";
import { useParams } from "next/navigation";

import { ManageBidRoundRequestTab } from "./tabs/ManageBidRoundRequestTab";
import { ManageBidRoundTab } from "./tabs/ManageBidRoundTab";
import { ManageUserTab } from "./tabs/ManageUserTab";
import { Dashboard } from "./tabs/Dashboard";
import { ManageAdmin } from "./tabs/ManageAdmin";
import { Col, Container } from "@/ui/layouts";
import { Invoice } from "./tabs/Invoice";
import { ManageGenre } from "./tabs/ManageGenre";
import { ManageSubmitTab } from "./ManageSubmitTab";


export function AdminRouter() {
  const param = useParams();

  const tab = param.tab as string;

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

  return (<Container className="bg-gray-light">{tabComponents[tab]}</Container> || <div>no tab matching</div>);
}