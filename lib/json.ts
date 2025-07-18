function extractJsonFromMarkdown(text: string): string {
  let cleanText = text.trim();
  const codeBlockPattern = /```(?:json)?\s*([\s\S]*?)\s*```/;
  const match = cleanText.match(codeBlockPattern);
  
  if (match) {
    cleanText = match[1].trim();
  }
  
  const jsonStart = cleanText.indexOf('{');
  const jsonEnd = cleanText.lastIndexOf('}');
  
  if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
    cleanText = cleanText.substring(jsonStart, jsonEnd + 1);
  }
  
  try {
    JSON.parse(cleanText);
    return cleanText;
  } catch (parseError) {
    console.log('Initial JSON parse failed, attempting cleanup...', parseError);

    cleanText = cleanText.replace(/("canvasCode"\s*:\s*")([\s\S]*?)(")/g, (match, p1, p2, p3) => {
      let safe = p2
        .replace(/\\/g, '\\\\')
        .replace(/\r?\n/g, '\\n')
        .replace(/"/g, '\\"');
      safe = safe.replace(/[\u0000-\u001F\u007F]/g, '');
      if (safe.length > 2000) {
        safe = safe.substring(0, 2000) + '\\n// Canvas code truncated for JSON safety';
      }
      return p1 + safe + p3;
    });

    cleanText = cleanText.replace(/,(\s*[}\]])/g, '$1');
    cleanText = cleanText.replace(/[\u0000-\u001F\u007F]/g, '');


    try {
      JSON.parse(cleanText);
      return cleanText;
    } catch (err2) {
      cleanText = cleanText.replace(/("canvasCode"\s*:\s*")[^"]*(")/g, '$1// Canvas code removed for JSON safety$2');
      return cleanText;
    }
  }
}

// Test cases
const testCases = [
  // JSON wrapped in markdown code blocks
  '```json\n{"designs": [{"id": 1, "name": "Test"}]}\n```',
  
  // JSON without code blocks
  '{"designs": [{"id": 1, "name": "Test"}]}',
  
  // JSON with extra text before and after
  'Here is your JSON response:\n```json\n{"designs": [{"id": 1, "name": "Test"}]}\n```\nThat completes the response.',
  
  // JSON with just the code block markers
  '```\n{"designs": [{"id": 1, "name": "Test"}]}\n```',
  
  // JSON with text before and after but no code blocks
  'Here is the response: {"designs": [{"id": 1, "name": "Test"}]} Hope this helps!',
];

// Run tests
export function testJsonExtraction() {
  console.log('Testing JSON extraction...');
  
  testCases.forEach((testCase, index) => {
    console.log(`\nTest Case ${index + 1}:`);
    console.log('Input:', testCase);
    
    try {
      const extracted = extractJsonFromMarkdown(testCase);
      console.log('Extracted:', extracted);
      
      const parsed = JSON.parse(extracted);
      console.log('✅ Successfully parsed JSON:', parsed);
    } catch (error) {
      console.log('❌ Failed to parse JSON:', error);
    }
  });
}

export { extractJsonFromMarkdown };