import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { orderId, customerName, total, items } = await req.json();

    const { data, error } = await resend.emails.send({
      // TEMPORARY: Use Resend's test address for now
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