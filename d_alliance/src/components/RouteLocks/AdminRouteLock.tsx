import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { type ReactNode } from "react";

type AdminRouteLockProps = {
    children: ReactNode;
}