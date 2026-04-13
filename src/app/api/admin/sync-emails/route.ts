import { syncExistingUserEmails } from "@/lib/supabase/services";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const updatedCount = await syncExistingUserEmails();

    return NextResponse.json({
      success: true,
      message: `Updated ${updatedCount} users with their emails`,
      updatedCount,
    });
  } catch (error) {
    console.error("Error syncing emails:", error);
    return NextResponse.json(
      { success: false, error: "Failed to sync emails" },
      { status: 500 },
    );
  }
}
