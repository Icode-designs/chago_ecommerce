"use client";

import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Input, Button } from "@/components/ui";

const PageHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.displaySm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
`;

const Toolbar = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const SearchInput = styled(Input)`
  max-width: 320px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${({ theme }) => theme.colors.surfaceContainerLowest};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const Th = styled.th`
  text-align: left;
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]};
  font-size: ${({ theme }) => theme.fontSizes.labelSm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textTertiary};
  text-transform: uppercase;
  letter-spacing: ${({ theme }) => theme.letterSpacings.wider};
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceContainerHigh};
  background: ${({ theme }) => theme.colors.surfaceContainerLow};
`;

const Td = styled.td`
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceContainerHigh};
  font-size: ${({ theme }) => theme.fontSizes.bodyMd};
  color: ${({ theme }) => theme.colors.onSurface};
`;

const Tr = styled.tr`
  &:last-child ${Td} {
    border-bottom: none;
  }
`;

const RoleBadge = styled.span<{ $role: string }>`
  padding: 4px 12px;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: ${({ theme }) => theme.fontSizes.labelSm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  text-transform: capitalize;
  background: ${({ theme, $role }) =>
    $role === "admin"
      ? "rgba(159, 64, 61, 0.1)"
      : $role === "vendor"
        ? "rgba(0, 102, 204, 0.1)"
        : theme.colors.surfaceContainerHigh};
  color: ${({ theme, $role }) =>
    $role === "admin"
      ? "#9F403D"
      : $role === "vendor"
        ? "#0066CC"
        : theme.colors.onSurface};
`;

export default function AdminUsersPage() {
  const router = useRouter();

  const users = [
    {
      id: "usr_1",
      email: "admin@chago.com",
      role: "admin",
      joined: "2024-01-15",
    },
    {
      id: "usr_2",
      email: "vendor@ceramics.com",
      role: "vendor",
      joined: "2024-02-20",
    },
    {
      id: "usr_3",
      email: "customer@gmail.com",
      role: "customer",
      joined: "2024-03-01",
    },
  ];

  const handleManage = (userId: string) => {
    router.push(`/admin/users/${userId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PageHeader>
        <Title>User Management</Title>
      </PageHeader>

      <Toolbar>
        <SearchInput placeholder="Search users by email..." />
        <Button $variant="secondary">Filter by Role</Button>
      </Toolbar>

      <div style={{ overflowX: "auto" }}>
        <Table>
          <thead>
            <tr>
              <Th>Email</Th>
              <Th>Role</Th>
              <Th>Joined</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <Tr key={u.id}>
                <Td style={{ fontWeight: 500 }}>{u.email}</Td>
                <Td>
                  <RoleBadge $role={u.role}>{u.role}</RoleBadge>
                </Td>
                <Td>{new Date(u.joined).toLocaleDateString()}</Td>
                <Td>
                  <Button
                    $variant="ghost"
                    $size="sm"
                    onClick={() => handleManage(u.id)}
                  >
                    Manage
                  </Button>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </div>
    </motion.div>
  );
}
