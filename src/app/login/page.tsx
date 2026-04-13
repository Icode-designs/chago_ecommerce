"use client";

import React, { useState, Suspense } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button, Input, InputWrapper, InputLabel } from "@/components/ui";
import { UserRole } from "@/lib/types";

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
  }
`;

const BrandPanel = styled.div`
  flex: 1;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary} 0%,
    ${({ theme }) => theme.colors.primaryDim} 100%
  );
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[8]};
  color: ${({ theme }) => theme.colors.onPrimary};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing[10]}
      ${({ theme }) => theme.spacing[6]};
    min-height: 200px;
  }
`;

const BrandLogo = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.displayMd};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.onPrimary};
  letter-spacing: ${({ theme }) => theme.letterSpacings.tight};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const BrandTagline = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.bodyLg};
  opacity: 0.7;
  text-align: center;
  max-width: 320px;
`;

const FormPanel = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[8]};
  background: ${({ theme }) => theme.colors.surface};
`;

const FormContainer = styled(motion.div)`
  width: 100%;
  max-width: 420px;
`;

const FormTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.headlineMd};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const FormSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.bodyMd};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const TabRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: 4px;
  background: ${({ theme }) => theme.colors.surfaceContainerLow};
  border-radius: ${({ theme }) => theme.radii.md};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const Tab = styled.button<{ $active?: boolean }>`
  flex: 1;
  padding: 0.625rem;
  border-radius: 6px;
  font-size: ${({ theme }) => theme.fontSizes.bodyMd};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.primary : theme.colors.textTertiary};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.surfaceContainerLowest : "transparent"};
  box-shadow: ${({ $active, theme }) => ($active ? theme.shadows.sm : "none")};
  transition: all ${({ theme }) => theme.transitions.fast};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[5]};
`;

const RoleSelect = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const RoleChip = styled.button<{ $active?: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: ${({ theme }) => theme.fontSizes.labelMd};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.primary : theme.colors.surfaceContainerHigh};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.onPrimary : theme.colors.onSurface};
  transition: all ${({ theme }) => theme.transitions.fast};
`;

const ForgotLink = styled.a`
  font-size: ${({ theme }) => theme.fontSizes.bodyMd};
  color: ${({ theme }) => theme.colors.tertiary};
  cursor: pointer;
  text-align: right;
  margin-top: -${({ theme }) => theme.spacing[2]};
`;

const ErrorBanner = styled.div`
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  background: rgba(159, 64, 61, 0.08);
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.fontSizes.bodyMd};
`;

const FooterText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.labelSm};
  color: ${({ theme }) => theme.colors.textTertiary};
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing[6]};
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  margin: ${({ theme }) => theme.spacing[6]} 0;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.colors.outlineVariant};
  }
`;

const DividerText = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.labelSm};
  color: ${({ theme }) => theme.colors.textTertiary};
`;

const OAuthButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

function LoginForm() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "signup" ? "signup" : "login";
  const [tab, setTab] = useState<"login" | "signup">(initialTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<UserRole>("customer");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, signInWithGoogle, signUpWithGoogle } = useAuth();
  const router = useRouter();
  const redirect = searchParams.get("redirect");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (tab === "login") {
        const result = await signIn(email, password);
        if (result.error) {
          setError(result.error);
        } else {
          router.push(redirect || "/dashboard");
        }
      } else {
        if (!fullName.trim()) {
          setError("Please enter your full name");
          setLoading(false);
          return;
        }
        const result = await signUp(email, password, fullName, role);
        if (result.error) {
          setError(result.error);
        } else {
          router.push("/role");
        }
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      const result = await signInWithGoogle();
      if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      console.error("Google sign-in error:", err);
      setError("Failed to sign in with Google");
    }
  };

  const handleGoogleSignUp = async () => {
    setError(null);
    try {
      const result = await signUpWithGoogle(role);
      if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      console.error("Google sign-up error:", err);
      setError("Failed to sign up with Google");
    }
  };

  return (
    <PageWrapper>
      <BrandPanel>
        <BrandLogo>Chago</BrandLogo>
        <BrandTagline>Curating your creative journey.</BrandTagline>
      </BrandPanel>

      <FormPanel>
        <FormContainer
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FormTitle>
            {tab === "login" ? "Welcome back" : "Create account"}
          </FormTitle>
          <FormSubtitle>
            {tab === "login"
              ? "Sign in to access your curated experience."
              : "Join the marketplace and start discovering."}
          </FormSubtitle>

          <TabRow>
            <Tab
              $active={tab === "login"}
              onClick={() => {
                setTab("login");
                setError(null);
              }}
            >
              Sign In
            </Tab>
            <Tab
              $active={tab === "signup"}
              onClick={() => {
                setTab("signup");
                setError(null);
              }}
            >
              Create Account
            </Tab>
          </TabRow>

          {error && <ErrorBanner>{error}</ErrorBanner>}

          {tab === "login" && (
            <>
              <OAuthButton
                type="button"
                $variant="secondary"
                $fullWidth
                onClick={handleGoogleSignIn}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
                Sign in with Google
              </OAuthButton>
              <Divider>
                <DividerText>or continue with email</DividerText>
              </Divider>
            </>
          )}

          {tab === "signup" && role === "customer" && (
            <>
              <OAuthButton
                type="button"
                $variant="secondary"
                $fullWidth
                onClick={handleGoogleSignUp}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
                Sign up with Google
              </OAuthButton>
              <Divider>
                <DividerText>or sign up with email</DividerText>
              </Divider>
            </>
          )}

          <Form onSubmit={handleSubmit}>
            {tab === "signup" && (
              <>
                <InputWrapper>
                  <InputLabel htmlFor="fullName">Full Name</InputLabel>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </InputWrapper>

                <InputWrapper>
                  <InputLabel>Account Type</InputLabel>
                  <RoleSelect>
                    <RoleChip
                      type="button"
                      $active={role === "customer"}
                      onClick={() => setRole("customer")}
                    >
                      Customer
                    </RoleChip>
                    <RoleChip
                      type="button"
                      $active={role === "vendor"}
                      onClick={() => setRole("vendor")}
                    >
                      Vendor
                    </RoleChip>
                  </RoleSelect>
                </InputWrapper>
              </>
            )}

            <InputWrapper>
              <InputLabel htmlFor="email">Email</InputLabel>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </InputWrapper>

            <InputWrapper>
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </InputWrapper>

            {tab === "login" && <ForgotLink>Forgot Password?</ForgotLink>}

            <Button type="submit" $size="lg" $fullWidth disabled={loading}>
              {loading
                ? "Please wait..."
                : tab === "login"
                  ? "Sign In"
                  : "Create Account"}
            </Button>
          </Form>

          <FooterText>
            © {new Date().getFullYear()} Chago. All rights reserved.
          </FooterText>
        </FormContainer>
      </FormPanel>
    </PageWrapper>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div />}>
      <LoginForm />
    </Suspense>
  );
}
