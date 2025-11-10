import { NextResponse } from 'next/server';
import { getOrchestrator } from '@/lib/agents/OrchestratorAgent';

export async function POST() {
  try {
    const orchestrator = getOrchestrator();

    // Generate a single video immediately
    await orchestrator.generateAndUploadVideo();

    return NextResponse.json({
      success: true,
      message: 'Video generation started',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
