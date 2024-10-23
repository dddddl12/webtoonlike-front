"use client";
import React, { ReactNode } from "react";
import { Text } from "@/ui/texts";
import { Box } from "@/ui/layouts";
import { useAdmin } from "@/states/UserState";

export function AdminProtector({ children }: {children: ReactNode}): ReactNode {
  const admin = useAdmin();

  if (!admin) {
    return (
      <div className='min-h-[30vh]'>
        <Box className='m-auto'>
          <Text>관리자만 접근 가능한 페이지입니다.</Text>
        </Box>
      </div>
    );
  }
  return children;
}