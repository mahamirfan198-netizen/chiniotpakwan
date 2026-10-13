import { Resend } from 'resend';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { orderId, customerName, total, items } = await req.json();

    const { data, error } = await resend.emails.send({
      from: 'Chiniot Pakwan <onboarding@resend.dev>',
      to: ['chiniotpakwann@gmail.com'],
      subject: `New Order #${orderId}`,
      html: `
        <h2>New Order Received!</h2>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Customer:</strong> ${customerName}</p>
        <p><strong>Total:</strong> ${total}</p>
        <p><strong>Items:</strong> ${items}</p>
      `,
    });

    if (error) return NextResponse.json({ error }, { status: 400 });
    return NextResponse.json({ success: true, id: data.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
