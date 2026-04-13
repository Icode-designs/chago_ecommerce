"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styled from "styled-components";
import { useAuth } from "@/hooks/useAuth";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.surface};
`;

const LoadingContent = styled.div`
  text-align: center;
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid ${({ theme }) => theme.colors.surfaceContainerHigh};
  border-top-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto ${({ theme }) => theme.spacing[4]};

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Message = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.bodyMd};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, refreshProfile } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Refresh profile to get latest data
        await refreshProfile();

        // Get query parameters
        const type = searchParams.get("type") || "signin";
        const role = searchParams.get("role") || "customer";

        // Redirect to profile completion for new signups
        if (type === "signup") {
          router.push(`/profile-completion?role=${role}&isNewUser=true`);
        } else {
          // For sign-in, go directly to dashboard
          router.push(`/${role}`);
        }
      } catch (err) {
        console.error("OAuth callback error:", err);
        setError("An error occurred. Please try again.");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    };

    handleCallback();
  }, [router, searchParams, refreshProfile]);

  if (error) {
    return (
      <Container>
        <LoadingContent>
          <Message style={{ color: "var(--error-color, red)" }}>
            {error}
          </Message>
        </LoadingContent>
      </Container>
    );
  }

  return (
    <Container>
      <LoadingContent>
        <Spinner />
        <Message>Processing your authentication...</Message>
      </LoadingContent>
    </Container>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <Container>
          <LoadingContent>
            <Spinner />
            <Message>Loading...</Message>
          </LoadingContent>
        </Container>
      }
    >
      <GoogleCallbackContent />
    </Suspense>
  );
}
