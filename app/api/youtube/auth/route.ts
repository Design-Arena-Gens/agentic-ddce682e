import { NextResponse } from 'next/server';
import { YouTubeUploadAgent } from '@/lib/agents/YouTubeUploadAgent';

export async function GET() {
  try {
    const uploader = new YouTubeUploadAgent();
    const authUrl = uploader.getAuthUrl();

    return NextResponse.redirect(authUrl);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
