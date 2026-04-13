"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Button, Input, InputWrapper, InputLabel } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing[4]};
`;

const Container = styled(motion.div)`
  width: 100%;
  max-width: 520px;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.spacing[8]};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.headlineLg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.bodyMd};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[5]};
`;

const AvatarSection = styled.div`
  display: flex;
  align-items: flex-end;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const AvatarDisplay = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid ${({ theme }) => theme.colors.primary};
`;

const AvatarPlaceholder = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.surfaceContainerHigh};
  border: 3px solid ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSizes.headlineLg};
  color: ${({ theme }) => theme.colors.primary};
`;

const AvatarInfo = styled.div`
  flex: 1;
`;

const InfoText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.labelSm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ErrorBanner = styled.div`
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  background: rgba(159, 64, 61, 0.08);
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.fontSizes.bodyMd};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-top: ${({ theme }) => theme.spacing[6]};
`;

function ProfileCompletionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, profile, signOut } = useAuth();
  const supabase = createClient();

  const role = searchParams.get("role") || profile?.role || "customer";
  const isNewUser = searchParams.get("isNewUser") === "true";

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    // Set initial values from user and profile
    if (user.user_metadata?.full_name) {
      setFullName(user.user_metadata.full_name);
    } else if (profile?.full_name) {
      setFullName(profile.full_name);
    }

    if (user.user_metadata?.avatar_url) {
      setAvatarUrl(user.user_metadata.avatar_url);
    } else if (profile?.avatar_url) {
      setAvatarUrl(profile.avatar_url);
    }

    if (profile?.phone) {
      setPhone(profile.phone);
    }

    setEmail(user.email || "");
  }, [user, profile, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!user) {
        setError("User not authenticated");
        return;
      }

      if (!fullName.trim()) {
        setError("Full name is required");
        setLoading(false);
        return;
      }

      // Update the profile in the database
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim(),
          phone: phone.trim() || null,
          avatar_url: avatarUrl || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (updateError) {
        setError(updateError.message || "Failed to update profile");
        return;
      }

      // Redirect to appropriate dashboard
      router.push(`/${role}`);
    } catch (err) {
      console.error("Profile completion error:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    // Redirect to dashboard without updating
    router.push(`/${role}`);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <PageWrapper>
      <Container
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title>Complete Your Profile</Title>
        <Subtitle>
          {isNewUser
            ? "Help us get to know you better. You can update this information anytime."
            : "Review and update your profile information."}
        </Subtitle>

        <Form onSubmit={handleSubmit}>
          <AvatarSection>
            {avatarUrl ? (
              <AvatarDisplay src={avatarUrl} alt={fullName} />
            ) : (
              <AvatarPlaceholder>
                {getInitials(fullName || email || "U")}
              </AvatarPlaceholder>
            )}
            <AvatarInfo>
              <InfoText>
                <strong>Email:</strong>
                <br />
                {email}
              </InfoText>
              {avatarUrl && (
                <InfoText style={{ marginTop: "0.5rem" }}>
                  Profile picture synced from Google
                </InfoText>
              )}
            </AvatarInfo>
          </AvatarSection>

          {error && <ErrorBanner>{error}</ErrorBanner>}

          <InputWrapper>
            <InputLabel htmlFor="fullName">Full Name *</InputLabel>
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
            <InputLabel htmlFor="phone">Phone Number (Optional)</InputLabel>
            <Input
              id="phone"
              type="tel"
              placeholder="Your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </InputWrapper>

          <InputWrapper>
            <InputLabel htmlFor="avatarUrl">
              Profile Picture URL (Optional)
            </InputLabel>
            <Input
              id="avatarUrl"
              type="url"
              placeholder="https://example.com/avatar.jpg"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
            />
          </InputWrapper>

          <ButtonGroup>
            {isNewUser && (
              <Button
                type="button"
                $variant="secondary"
                $fullWidth
                onClick={handleSkip}
              >
                Skip for now
              </Button>
            )}
            <Button type="submit" $size="lg" $fullWidth disabled={loading}>
              {loading ? "Saving..." : "Complete Profile"}
            </Button>
          </ButtonGroup>
        </Form>
      </Container>
    </PageWrapper>
  );
}

export default function ProfileCompletionPage() {
  return (
    <Suspense fallback={<div />}>
      <ProfileCompletionForm />
    </Suspense>
  );
}
