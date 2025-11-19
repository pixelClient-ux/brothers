import ResetPasswordClient from "./ResetPasswordClient";

interface resetPasswordProps {
  params: Promise<{ token: string }>;
}

export default async function Page({ params }: resetPasswordProps) {
  const { token } = await params;
  return <ResetPasswordClient token={token} />;
}
