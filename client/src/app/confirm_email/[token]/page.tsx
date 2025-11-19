import ConfirmEmailClient from "./ConfrimEmail";

interface Props {
  params: Promise<{ token: string }>;
}

export default async function Page({ params }: Props) {
  const { token } = await params; // ⬅️ FIXED

  return <ConfirmEmailClient token={token} />;
}
