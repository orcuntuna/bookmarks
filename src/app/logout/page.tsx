"use client"

import {useRouter} from "next/navigation";
import {createClientComponentClient} from "@supabase/auth-helpers-nextjs";
import {useEffect} from "react";

const LogoutPage = () => {

  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    handleLogout().then()
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/')
  }

  return null
}

export default LogoutPage
