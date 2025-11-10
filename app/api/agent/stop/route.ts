import { NextResponse } from 'next/server';
import { getOrchestrator } from '@/lib/agents/OrchestratorAgent';

export async function POST() {
  try {
    const orchestrator = getOrchestrator();
    orchestrator.stop();

    return NextResponse.json({
      success: true,
      message: 'Agent stopped successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
