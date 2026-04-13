"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Input, Button } from "@/components/ui";
import { getAllUsers } from "@/lib/supabase/services";
import { useAuth } from "@/hooks/useAuth";
import type { Profile } from "@/lib/types";

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

const FilterContainer = styled.div`
  position: relative;
`;

const FilterDropdown = styled.div<{ $isOpen: boolean }>`
  display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: ${({ theme }) => theme.colors.surfaceContainerLowest};
  border: 1px solid ${({ theme }) => theme.colors.surfaceContainerHigh};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
  z-index: 10;
  overflow: hidden;
  min-width: 180px;
`;

const FilterOption = styled.button<{ $active: boolean }>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border: none;
  background: ${({ theme, $active }) =>
    $active ? theme.colors.surfaceContainerHigh : "transparent"};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.primary : theme.colors.onSurface};
  font-weight: ${({ theme, $active }) =>
    $active ? theme.fontWeights.semibold : theme.fontWeights.regular};
  cursor: pointer;
  text-align: left;
  transition: all ${({ theme }) => theme.transitions.fast};
  font-size: ${({ theme }) => theme.fontSizes.bodyMd};
  text-transform: capitalize;

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceContainerHigh};
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
  const { user: currentUser } = useAuth();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const loadUsers = async () => {
      try {
        const fetchedUsers = await getAllUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Failed to load users:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleManage = (userId: string) => {
    router.push(`/admin/users/${userId}`);
  };

  // Filter users based on role and search query, excluding current admin
  const filteredUsers = users.filter((user) => {
    const isNotCurrentUser = user.id !== currentUser?.id;
    const matchesRole = !selectedRole || user.role === selectedRole;
    const matchesSearch = (user.email || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return isNotCurrentUser && matchesRole && matchesSearch;
  });

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <PageHeader>
          <Title>User Management</Title>
        </PageHeader>
        <div style={{ padding: "3rem 2rem", textAlign: "center" }}>
          <p style={{ fontSize: "1rem", color: "#86868B" }}>Loading users...</p>
        </div>
      </motion.div>
    );
  }

  const roles = ["admin", "vendor", "customer"];

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
        <SearchInput
          placeholder="Search users by email..."
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchQuery(e.target.value)
          }
        />
        <FilterContainer>
          <Button
            $variant="secondary"
            onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
          >
            {selectedRole ? `Filter: ${selectedRole}` : "Filter by Role"}
          </Button>
          <FilterDropdown $isOpen={filterDropdownOpen}>
            <FilterOption
              $active={selectedRole === null}
              onClick={() => {
                setSelectedRole(null);
                setFilterDropdownOpen(false);
              }}
            >
              All Roles
            </FilterOption>
            {roles.map((role) => (
              <FilterOption
                key={role}
                $active={selectedRole === role}
                onClick={() => {
                  setSelectedRole(role);
                  setFilterDropdownOpen(false);
                }}
              >
                {role}
              </FilterOption>
            ))}
          </FilterDropdown>
        </FilterContainer>
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
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u) => (
                <Tr key={u.id}>
                  <Td style={{ fontWeight: 500 }}>{u.email || "No email"}</Td>
                  <Td>
                    <RoleBadge $role={u.role}>{u.role}</RoleBadge>
                  </Td>
                  <Td>
                    {u.created_at
                      ? new Date(u.created_at).toLocaleDateString()
                      : "N/A"}
                  </Td>
                  <Td>
                    <Button
                      $variant="ghost"
                      $size="sm"
                      onClick={() => router.push(`/admin/users/${u.id}`)}
                    >
                      Manage
                    </Button>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td
                  colSpan={4}
                  style={{ textAlign: "center", padding: "32px" }}
                >
                  No users found matching the selected filters.
                </Td>
              </Tr>
            )}
          </tbody>
        </Table>
      </div>
    </motion.div>
  );
}
