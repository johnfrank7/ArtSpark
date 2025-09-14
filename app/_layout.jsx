import React, { useEffect, useState } from "react";
import { Slot, useRouter, useSegments } from "expo-router";
import { getUser } from "../utils/storage";

export default function Layout() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const checkAuth = async () => {
      const loggedUser = await getUser();
      setUser(loggedUser);
      setLoading(false);

      // Only redirect if user is not logged in AND they're trying to access protected routes
      if (!loggedUser) {
        if (segments[0] === "goals") {
          router.replace("/login");
        }
      }
    };

    checkAuth();
  }, [segments]);

  if (loading) return null; // could show spinner here

  return <Slot />;
}
