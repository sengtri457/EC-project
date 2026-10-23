import { buildInvoiceHtml } from "./invoiceTemplate";
import { Order } from "@/types";

export function downloadInvoice(order: Order): void {
  const html = buildInvoiceHtml(order);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `invoice-${order.id}.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}
