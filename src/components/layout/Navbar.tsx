"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import AISearchBar from "@/components/ai/AISearchBar";
import Logo from "../logo";

const Header = styled(motion.header)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: ${({ theme }) => theme.zIndices.sticky};
  background: ${({ theme }) => theme.colors.inversePrimary};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  height: ${({ theme }) => theme.layout.headerHeight};
  display: flex;
  align-items: center;
`;

const Nav = styled.nav`
  width: 100%;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing[6]};
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 0 ${({ theme }) => theme.spacing[4]};
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[8]};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

const SearchDesktopWrapper = styled.div`
  display: none;
  margin-right: ${({ theme }) => theme.spacing[4]};
  width: 300px;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: block;
  }
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.bodyMd};
  font-weight: ${({ theme, $active }) =>
    $active ? theme.fontWeights.semibold : theme.fontWeights.medium};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.primary : theme.colors.onSurfaceVariant};
  transition: color ${({ theme }) => theme.transitions.fast};
  text-decoration: none;
  position: relative;
  padding-bottom: 2px;

  &::after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background: ${({ theme, $active }) =>
      $active ? theme.colors.primary : "transparent"};
    transition: background ${({ theme }) => theme.transitions.fast};
  }

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const IconButton = styled.button`
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radii.full};
  color: ${({ theme }) => theme.colors.onSurface};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceContainerLow};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const CartCount = styled.span`
  position: absolute;
  top: 2px;
  right: 2px;
  width: 16px;
  height: 16px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.tertiary};
  color: white;
  font-size: 10px;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HamburgerButton = styled(IconButton)`
  display: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: flex;
  }
`;

// Mobile Menu
const MobileOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: ${({ theme }) => theme.colors.overlay};
  z-index: ${({ theme }) => theme.zIndices.overlay};
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 300px;
  background: ${({ theme }) => theme.colors.surfaceContainerLowest};
  z-index: 1500;
  padding: ${({ theme }) => theme.spacing[8]} ${({ theme }) => theme.spacing[6]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[6]};
`;

const MobileNavLink = styled(Link)<{ $active?: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.titleMd};
  font-weight: ${({ theme, $active }) =>
    $active ? theme.fontWeights.semibold : theme.fontWeights.medium};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.primary : theme.colors.onSurface};
  padding: ${({ theme }) => theme.spacing[3]} 0;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.tertiary};
  }
`;

const MobileMenuClose = styled(IconButton)`
  align-self: flex-end;
`;

const AuthLink = styled(Link)`
  font-size: ${({ theme }) => theme.fontSizes.bodyMd};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.onPrimary};
  background: ${({ theme }) => theme.colors.primary};
  padding: 0.5rem 1.25rem;
  border-radius: ${({ theme }) => theme.radii.md};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { itemCount } = useCart();
  const { user, profile } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Header
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          boxShadow: scrolled ? "0px 4px 12px rgba(45, 51, 56, 0.03)" : "none",
        }}
      >
        <Nav>
          <Logo size="sm" dark />

          <NavLinks>
            <NavLink href="/shop" $active={pathname === "/shop"}>
              Shop
            </NavLink>
            <NavLink href="/collections" $active={pathname === "/collections"}>
              Collections
            </NavLink>
            <NavLink href="/shop?filter=new" $active={false}>
              New Arrivals
            </NavLink>
          </NavLinks>

          <NavActions>
            <SearchDesktopWrapper>
              <AISearchBar compact />
            </SearchDesktopWrapper>

            <Link href="/cart">
              <IconButton as="span" aria-label="Cart">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
                {itemCount > 0 && <CartCount>{itemCount}</CartCount>}
              </IconButton>
            </Link>

            {user ? (
              <Link href={`/${profile?.role || "customer"}`}>
                <IconButton as="span" aria-label="Account">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                  </svg>
                </IconButton>
              </Link>
            ) : (
              <AuthLink href="/login">Sign In</AuthLink>
            )}

            <HamburgerButton
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </HamburgerButton>
          </NavActions>
        </Nav>
      </Header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <MobileOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <MobileMenu
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <MobileMenuClose
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </MobileMenuClose>

              <MobileNavLink
                href="/shop"
                onClick={() => setMobileMenuOpen(false)}
                $active={pathname === "/shop"}
              >
                Shop
              </MobileNavLink>
              <MobileNavLink
                href="/collections"
                onClick={() => setMobileMenuOpen(false)}
                $active={pathname === "/collections"}
              >
                Collections
              </MobileNavLink>
              <MobileNavLink
                href="/shop?filter=new"
                onClick={() => setMobileMenuOpen(false)}
                $active={false}
              >
                New Arrivals
              </MobileNavLink>
              <MobileNavLink
                href="/cart"
                onClick={() => setMobileMenuOpen(false)}
              >
                Cart {itemCount > 0 && `(${itemCount})`}
              </MobileNavLink>

              {user ? (
                <MobileNavLink
                  href={`/${profile?.role || "customer"}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </MobileNavLink>
              ) : (
                <>
                  <MobileNavLink
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </MobileNavLink>
                  <MobileNavLink
                    href="/login?tab=signup"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Create Account
                  </MobileNavLink>
                </>
              )}
            </MobileMenu>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
