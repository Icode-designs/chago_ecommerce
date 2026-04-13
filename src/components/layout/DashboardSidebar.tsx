"use client";

import React from "react";
import styled from "styled-components";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const SidebarContainer = styled.aside`
  width: 260px;
  background: ${({ theme }) => theme.colors.surfaceContainerLowest};
  border-right: 1px solid ${({ theme }) => theme.colors.surfaceContainerHigh};
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing[6]} ${({ theme }) => theme.spacing[4]};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none; // Would be replaced by a drawer component in a real app
  }
`;

const NavList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.bodyMd};
  font-weight: ${({ theme, $active }) =>
    $active ? theme.fontWeights.medium : theme.fontWeights.regular};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.primary : theme.colors.textSecondary};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.surfaceContainerLow : "transparent"};
  transition: all ${({ theme }) => theme.transitions.fast};
  text-decoration: none;

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceContainerLow};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const UserSection = styled.div`
  margin-top: auto;
  padding-top: ${({ theme }) => theme.spacing[6]};
  border-top: 1px solid ${({ theme }) => theme.colors.surfaceContainerHigh};
`;

const UserName = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.bodyMd};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.onSurface};
`;

const UserEmail = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.labelSm};
  color: ${({ theme }) => theme.colors.textTertiary};
`;

const customerLinks = [
  { name: "Overview", href: "/customer" },
  { name: "Orders", href: "/customer/orders" },
  { name: "Wishlist", href: "/customer/wishlist" },
  { name: "Returns", href: "/customer/returns" },
  { name: "Reviews", href: "/customer/reviews" },
  { name: "Settings", href: "/customer/profile" },
];

const vendorLinks = [
  { name: "Dashboard", href: "/vendor" },
  { name: "Products", href: "/vendor/products" },
  { name: "Orders", href: "/vendor/orders" },
  { name: "Analytics", href: "/vendor/analytics" },
  { name: "Wallet", href: "/vendor/wallet" },
];

const adminLinks = [
  { name: "Dashboard", href: "/admin" },
  { name: "Users", href: "/admin/users" },
  { name: "Categories", href: "/admin/categories" },
  { name: "Disputes", href: "/admin/disputes" },
  { name: "Payouts", href: "/admin/payouts" },
  { name: "Analytics", href: "/admin/analytics" },
  { name: "Policies", href: "/admin/policies" },
  { name: "Security", href: "/admin/security" },
];

const SignOutButton = styled.button`
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.bodyMd};
  font-weight: ${({ theme }) => theme.fontWeights.regular};
  color: ${({ theme }) => theme.colors.textSecondary};
  background: transparent;
  transition: all ${({ theme }) => theme.transitions.fast};
  text-decoration: none;
  text-align: left;
  border: none;
  cursor: pointer;
  font-family: inherit;

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceContainerLow};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { user, profile, signOut } = useAuth();

  const isVendor = pathname.startsWith("/vendor");
  const isAdmin = pathname.startsWith("/admin");
  const links = isAdmin ? adminLinks : isVendor ? vendorLinks : customerLinks;

  return (
    <SidebarContainer>
      <NavList>
        {links.map((link) => (
          <NavLink
            key={link.name}
            href={link.href}
            $active={pathname === link.href}
          >
            {link.name}
          </NavLink>
        ))}
        <SignOutButton onClick={signOut}>Sign Out</SignOutButton>
      </NavList>
      <UserSection>
        <UserName>{profile?.full_name || "User"}</UserName>
        <UserEmail>{user?.email || ""}</UserEmail>
      </UserSection>
    </SidebarContainer>
  );
}
