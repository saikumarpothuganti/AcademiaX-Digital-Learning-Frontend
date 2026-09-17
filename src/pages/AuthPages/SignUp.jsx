import React from "react";
import SignUpForm from "@/components/auth/SignUpForm.jsx";
import PageMeta from "@/components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";

export default function SignUp() {
  return (
    <>
      <PageMeta title="Sign Up | AcademiaX Digital Learning" description="Create an AcademiaX Account" />
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    </>
  );
}
