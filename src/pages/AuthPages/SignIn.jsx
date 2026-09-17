import React from "react";
import SignInForm from "@/components/auth/SignInForm.jsx";
import PageMeta from "@/components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";

export default function SignIn() {
  return (
    <>
      <PageMeta title="Sign In | AcademiaX Digital Learning" description="Sign in to your AcademiaX Account" />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
