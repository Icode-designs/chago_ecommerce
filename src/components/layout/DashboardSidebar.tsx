"use client";

import React, { useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const SidebarContainer = styled.aside<{ $isOpen?: boolean }>`
  width: 260px;
  background: ${({ theme }) => theme.colors.inverseSurface};
  border-right: 1px solid ${({ theme }) => theme.colors.surfaceContainerHigh};
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing[6]} ${({ theme }) => theme.spacing[4]};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    position: fixed;
    left: 0;
    top: ${({ theme }) => theme.layout.headerHeight};
    height: calc(100vh - ${({ theme }) => theme.layout.headerHeight});
    z-index: 999;
    transform: translateX(${({ $isOpen }) => ($isOpen ? "0" : "-100%")});
    transition: transform 0.3s ease;
    box-shadow: ${({ $isOpen }) =>
      $isOpen ? "2px 0 8px rgba(0, 0, 0, 0.15)" : "none"};
  }
`;

const Overlay = styled.div<{ $isOpen?: boolean }>`
  display: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
    position: fixed;
    top: ${({ theme }) => theme.layout.headerHeight};
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 998;
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
    $active ? theme.fontWeights.medium : theme.fontWeights.semibold};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.text : theme.colors.textTertiary};
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

const ToggleButton = styled.button`
  display: none;
  width: 45px;
  height: 36px;
  border: none;
  background: ${({ theme }) => theme.colors.inverseSurface};
  cursor: pointer;
  padding: 0;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.inversePrimary};
  border-radius: 50%;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  transition: all ${({ theme }) => theme.transitions.fast};
  position: absolute;
  top: 0px;
  right: -30px;
  z-index: 1001;
  box-shadow: -2px 0 6px rgba(0, 0, 0, 0.1);

  &:hover {
    box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: flex;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    display: none !important;
  }
`;

export default function DashboardSidebar({
  isOpen,
  onClose,
  onToggle,
}: {
  isOpen?: boolean;
  onClose?: () => void;
  onToggle?: () => void;
}) {
  const pathname = usePathname();
  const { user, profile, signOut } = useAuth();

  const isVendor = pathname.startsWith("/vendor");
  const isAdmin = pathname.startsWith("/admin");
  const links = isAdmin ? adminLinks : isVendor ? vendorLinks : customerLinks;

  const handleLinkClick = () => {
    onClose?.();
  };
  function handleSignOut() {
    signOut();
    redirect("/");
  }

  return (
    <>
      <Overlay $isOpen={isOpen} onClick={onClose} />
      <SidebarContainer $isOpen={isOpen}>
        <ToggleButton
          onClick={onToggle}
          aria-label="Toggle Sidebar"
          title="Toggle Sidebar"
        >
          {isOpen ? (
            // Arrow left (sidebar is open, show arrow to close it)
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              width="22"
              height="22"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          ) : (
            // Arrow right (sidebar is closed, show arrow to open it)
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              width="22"
              height="22"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          )}
        </ToggleButton>
        <NavList>
          {links.map((link) => (
            <NavLink
              key={link.name}
              href={link.href}
              $active={pathname === link.href}
              onClick={handleLinkClick}
            >
              {link.name}
            </NavLink>
          ))}
          <SignOutButton onClick={handleSignOut}>Sign Out</SignOutButton>
        </NavList>
        <UserSection>
          <UserName>{profile?.full_name || "User"}</UserName>
          <UserEmail>{user?.email || ""}</UserEmail>
        </UserSection>
      </SidebarContainer>
    </>
  );
}
