import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import SignUpForm from "@/components/auth/SignUpForm";
import PageMeta from "@/components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
export default function SignUp() {
    return (_jsxs(_Fragment, { children: [_jsx(PageMeta, { title: "React.js SignUp Dashboard | TailAdmin - React.js Admin Dashboard Template", description: "This is React.js SignUp Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template" }), _jsx(AuthLayout, { children: _jsx(SignUpForm, {}) })] }));
}
