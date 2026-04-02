import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
    const { getToken } = await auth();
    const token = await getToken({ template: 'teste' });
    return NextResponse.json({ token });
}