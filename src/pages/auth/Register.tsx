
import React from "react";
import { Link } from "react-router-dom";
import RegisterForm from "@/components/auth/RegisterForm";
import RegisterPageLayout from "@/components/auth/RegisterPageLayout";

export default function Register() {
  return (
    <RegisterPageLayout>
      <RegisterForm />
    </RegisterPageLayout>
  );
}
