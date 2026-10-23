import InvoiceClient from "@/components/InvoiceClient";

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  return <InvoiceClient orderId={orderId} />;
}
