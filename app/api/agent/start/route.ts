import { NextResponse } from 'next/server';
import { getOrchestrator } from '@/lib/agents/OrchestratorAgent';

export async function POST() {
  try {
    const orchestrator = getOrchestrator();
    await orchestrator.start();

    return NextResponse.json({
      success: true,
      message: 'Agent started successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
