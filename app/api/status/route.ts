import { NextResponse } from 'next/server';
import { getOrchestrator } from '@/lib/agents/OrchestratorAgent';

export async function GET() {
  try {
    const orchestrator = getOrchestrator();
    const status = orchestrator.getStatus();

    return NextResponse.json({
      success: true,
      status: status.isRunning ? 'Running' : 'Idle',
      isRunning: status.isRunning,
      videos: status.videos,
      logs: status.logs,
      stats: {
        total: status.totalVideos,
        uploaded: status.uploadedVideos,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
