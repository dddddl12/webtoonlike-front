"use client";
import Image from "next/image";
import { Col, Row } from "@/components/ui/common";
import { ReactNode } from "react";
import { useClerk, useUser } from "@clerk/nextjs";

export default function AccountProfile({ allowEdit, children }: {
  allowEdit?: boolean;
  children?: ReactNode;
}) {
  const clerk = useClerk();
  const { user } = useUser();
  if (!user) {
    return null;
  }
  return <Row className="gap-12">
    <div>
      <Image
        src={user.imageUrl}
        alt="profile_image"
        style={{ objectFit: "cover" }}
        className="rounded-full"
        width={160}
        height={160}
      />
      {allowEdit
        && <div className="text-center pt-5">
          <span className="clickable" onClick={() => {
            clerk.openUserProfile();
          }}>계정 설정</span>
        </div>}
    </div>
    <Col className="justify-center w-full">
      <p className="font-bold text-3xl">
        {user.fullName}
      </p>
      <p className="text-xl">
        {user.primaryEmailAddress?.emailAddress}
      </p>
      {children}
    </Col>
  </Row>;
}
