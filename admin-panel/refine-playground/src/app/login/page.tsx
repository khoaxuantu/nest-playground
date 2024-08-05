import { AuthProviderServer } from "@lib/providers/auth-provider";
import { AuthPage } from "@refinedev/chakra-ui";
import { redirect } from "next/navigation";

export default async function Login() {
  const data = await getData();

  if (data.authenticated) {
    redirect(data?.redirectTo || "/");
  }

  return <AuthPage type="login" />;
}

async function getData() {
  const { authenticated, redirectTo, error } = await AuthProviderServer.check();

  return {
    authenticated,
    redirectTo,
    error,
  };
}
