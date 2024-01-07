import React from "react";
import {Metadata} from "next";
import {Meta} from "@/utils/constants/Meta";

const Layout = ({children}: {children: React.ReactNode}) => {
  return children
}

export const metadata: Metadata = Meta.login

export default Layout
