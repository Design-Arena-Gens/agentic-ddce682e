import { NextRequest, NextResponse } from 'next/server';
import { YouTubeUploadAgent } from '@/lib/agents/YouTubeUploadAgent';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { success: false, error: 'No authorization code provided' },
        { status: 400 }
      );
    }

    const uploader = new YouTubeUploadAgent();
    await uploader.setCredentials(code);

    return NextResponse.json({
      success: true,
      message: 'YouTube authentication successful! You can now close this window.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
