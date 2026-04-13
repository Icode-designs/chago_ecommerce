"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button, Card } from "@/components/ui";
import {
  getProfile,
  suspendUser,
  unsuspendUser,
} from "@/lib/supabase/services";
import { useAuth } from "@/hooks/useAuth";
import type { Profile } from "@/lib/types";

const PageHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const BackButton = styled(Link)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.surfaceContainerLow};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: background 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceContainerHigh};
  }
`;

const TitleColumn = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.displaySm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.bodyMd};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${({ theme }) => theme.spacing[6]};

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: 1fr;
  }
`;

const SectionContainer = styled(Card)`
  padding: ${({ theme }) => theme.spacing[6]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.titleMd};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.primary};
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing[3]} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceContainerHigh};

  &:last-child {
    border-bottom: none;
  }
`;

export default function AdminUserDetailPage() {
  const params = useParams();
  const { user: currentUser, profile: currentProfile } = useAuth();
  const userId = typeof params.id === "string" ? params.id : "unknown";
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [suspending, setSuspending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const profile = await getProfile(userId);
        setUserProfile(profile);
      } catch (err) {
        console.error("Failed to load user:", err);
        setError("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [userId]);

  const handleSuspendUser = async () => {
    // Prevent admin from suspending another admin
    if (userProfile?.role === "admin" && currentProfile?.role === "admin") {
      setError("You cannot suspend another admin");
      return;
    }

    setSuspending(true);
    setError(null);
    setSuccess(null);

    try {
      if (userProfile?.is_suspended) {
        await unsuspendUser(userId);
        setSuccess("User unsuspended successfully");
        setUserProfile({
          ...userProfile,
          is_suspended: false,
        } as Profile);
      } else {
        await suspendUser(userId);
        setSuccess("User suspended successfully");
        setUserProfile({
          ...userProfile,
          is_suspended: true,
        } as Profile);
      }
    } catch (err) {
      console.error("Failed to update user status:", err);
      setError("Failed to update user status");
    } finally {
      setSuspending(false);
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div style={{ textAlign: "center", padding: "64px 0" }}>
          Loading user profile...
        </div>
      </motion.div>
    );
  }

  if (!userProfile) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div style={{ textAlign: "center", padding: "64px 0" }}>
          User not found
        </div>
      </motion.div>
    );
  }

  const canSuspend =
    currentProfile?.role === "admin" &&
    !(userProfile.role === "admin" && currentProfile.role === "admin");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PageHeader>
        <BackButton href="/admin/users">←</BackButton>
        <TitleColumn>
          <Title>User Details</Title>
          <Subtitle>ID: {userProfile.id}</Subtitle>
        </TitleColumn>
        {canSuspend && (
          <Button
            $variant="secondary"
            onClick={handleSuspendUser}
            disabled={suspending}
            style={{
              color: userProfile.is_suspended ? "#2E7D32" : "#9F403D",
              borderColor: userProfile.is_suspended ? "#2E7D32" : "#9F403D",
            }}
          >
            {suspending
              ? "Processing..."
              : userProfile.is_suspended
                ? "Unsuspend User"
                : "Suspend User"}
          </Button>
        )}
      </PageHeader>

      {error && (
        <div
          style={{
            padding: "12px 16px",
            marginBottom: "16px",
            backgroundColor: "rgba(159, 64, 61, 0.1)",
            color: "#9F403D",
            borderRadius: "8px",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            padding: "12px 16px",
            marginBottom: "16px",
            backgroundColor: "rgba(46, 125, 50, 0.1)",
            color: "#2E7D32",
            borderRadius: "8px",
            fontSize: "14px",
          }}
        >
          {success}
        </div>
      )}

      <DetailGrid>
        <div>
          <SectionContainer>
            <SectionTitle>Profile Information</SectionTitle>
            <InfoRow>
              <span>Full Name</span>
              <span style={{ fontWeight: 500 }}>
                {userProfile.full_name || "N/A"}
              </span>
            </InfoRow>
            <InfoRow>
              <span>Email</span>
              <span style={{ fontWeight: 500 }}>
                {userProfile.email || "N/A"}
              </span>
            </InfoRow>
            <InfoRow>
              <span>Phone</span>
              <span style={{ fontWeight: 500 }}>
                {userProfile.phone || "N/A"}
              </span>
            </InfoRow>
            <InfoRow>
              <span>Joined</span>
              <span style={{ fontWeight: 500 }}>
                {userProfile.created_at
                  ? new Date(userProfile.created_at).toLocaleDateString()
                  : "N/A"}
              </span>
            </InfoRow>
            <InfoRow>
              <span>Role</span>
              <span style={{ fontWeight: 500, textTransform: "capitalize" }}>
                {userProfile.role}
              </span>
            </InfoRow>
            <InfoRow>
              <span>Status</span>
              <span
                style={{
                  fontWeight: 500,
                  color: userProfile.is_suspended ? "#9F403D" : "#2E7D32",
                }}
              >
                {userProfile.is_suspended ? "Suspended" : "Active"}
              </span>
            </InfoRow>
          </SectionContainer>
        </div>

        <div>
          <SectionContainer>
            <SectionTitle>Quick Actions</SectionTitle>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {userProfile.role === "admin" &&
              currentProfile?.role === "admin" ? (
                <div
                  style={{
                    padding: "12px",
                    backgroundColor: "rgba(159, 64, 61, 0.1)",
                    color: "#9F403D",
                    borderRadius: "6px",
                    fontSize: "14px",
                    textAlign: "center",
                  }}
                >
                  Cannot suspend another admin
                </div>
              ) : (
                <Button
                  $variant="secondary"
                  $fullWidth
                  onClick={handleSuspendUser}
                  disabled={suspending}
                  style={{
                    color: userProfile.is_suspended ? "#2E7D32" : "#9F403D",
                    borderColor: userProfile.is_suspended
                      ? "#2E7D32"
                      : "#9F403D",
                  }}
                >
                  {suspending
                    ? "Processing..."
                    : userProfile.is_suspended
                      ? "Unsuspend User"
                      : "Suspend User"}
                </Button>
              )}
            </div>
          </SectionContainer>
        </div>
      </DetailGrid>
    </motion.div>
  );
}
