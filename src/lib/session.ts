import { cookies } from "next/headers";
import { getAuth } from "firebase-admin/auth";
import { getAdminApp } from "./firebase-admin";

export async function getUserFromSession() {
  const cookieStore = cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) return null;

  try {
    const decodedClaims = await getAuth(getAdminApp()).verifySessionCookie(session, true);

    return {
      uid: decodedClaims.uid,
      name: decodedClaims.name || decodedClaims.email?.split("@")[0] || "User",
      email: decodedClaims.email || "",
      avatar: decodedClaims.picture || "/default-avatar.png",
    };
  } catch (error) {
    console.error("Invalid session cookie:", error);
    return null;
  }
}
