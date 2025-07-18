import { NextRequest, NextResponse } from 'next/server';
import { extractJsonFromMarkdown, testJsonExtraction } from '@/lib/json';

export async function GET() {
  try {
    // Run JSON extraction tests
    console.log('Running JSON extraction tests...');
    testJsonExtraction();
    
    const testJson = `\`\`\`json
{
  "designs": [
    {
      "id": 1,
      "name": "Test Design",
      "canvasCode": "var img = new Image(); img.src = 'data:image/png;base64,very-long-string-here';"
    }
  ]
}
\`\`\``;
    
    console.log('Testing problematic JSON extraction...');
    const cleaned = extractJsonFromMarkdown(testJson);
    console.log('Cleaned JSON:', cleaned);
    
    const parsed = JSON.parse(cleaned);
    console.log('Successfully parsed:', parsed);
    
    return NextResponse.json({
      success: true,
      message: 'JSON extraction tests completed successfully',
      testResult: parsed
    });
    
  } catch (error) {
    console.error('Test failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { testJson } = await request.json();
    
    if (!testJson) {
      return NextResponse.json(
        { error: 'testJson is required' },
        { status: 400 }
      );
    }
    
    const cleaned = extractJsonFromMarkdown(testJson);
    const parsed = JSON.parse(cleaned);
    
    return NextResponse.json({
      success: true,
      cleaned,
      parsed
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
