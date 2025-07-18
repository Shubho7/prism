import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { fallbackDesigns } from '@/lib/fallback-designs';
import { extractJsonFromMarkdown } from '@/lib/json-utils';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error('Missing environment variable');
}
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(request: NextRequest) {
  try {
    const { category, imageData } = await request.json();

    if (!category || !imageData) {
      return NextResponse.json(
        { error: 'Category and image data are required' },
        { status: 400 }
      );
    }

    // If any issue with API key, return fallback designs
    if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_AI_API_KEY) {
      console.log('No Gemini API key found, using fallback designs');
      return NextResponse.json({ designs: fallbackDesigns });
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

      const systemPrompt = `You are a professional certificate designer with expertise in typography, color theory, layout design, and image analysis.
      Your task is to carefully analyze the provided certificate background image and create 5 distinct certificate designs that work harmoniously with the background.

      CRITICAL IMAGE ANALYSIS STEPS:
      1. Examine the background image's color palette (dominant colors, light/dark areas)
      2. Identify safe text placement zones (areas with good contrast potential)
      3. Analyze the background's visual style (modern, classic, elegant, etc.)
      4. Determine optimal text colors for maximum readability against the background
      5. Consider the background's decorative elements and work around them
      6. MOST IMPORTANT: Identify the central content area where text should be placed (usually the light/neutral area in the center)
      7. Avoid decorative borders, gradients, and ornamental areas at the edges

      LAYOUT ANALYSIS FOR CERTIFICATE BACKGROUNDS:
      - Most certificate backgrounds have a central content area (often light/white) surrounded by decorative borders
      - Text should be positioned within this central safe zone, typically 20-30% inward from the edges
      - For 800x600 canvas, safe text zone is approximately: x: 160-640, y: 120-480
      - The text elements MUST appear in this specific order with these positions:
        1. Title: Upper portion of safe zone (y: 160-180)
        2. Presentation line: Below title (y: 210-230) - e.g., "This certificate is awarded to..."
        3. Recipient name: Prominent middle area (y: 260-280)
        4. Certificate body: 2-3 lines appreciating the recipient (y: 340-380)
        5. Date: Bottom left of safe zone (y: 450-480)
        6. Signature: Bottom right of safe zone (y: 450-480)

      POSITIONING RULES:
      - NEVER place text in decorative border areas (edges of certificate)
      - Keep all text within central content area
      - Follow this EXACT order and positioning for text elements:
        1. Title: Center horizontally (x: 400), upper safe zone (y: 160-180)
        2. Presentation line: Center horizontally (x: 400), below title (y: 210-230)
        3. Recipient name: Center horizontally (x: 400), prominent middle area (y: 260-280)
        4. Certificate body: Center horizontally (x: 400), below recipient name (y: 340-380)
        5. Date: Left side with margin (x: 200), bottom safe zone (y: 450-480)
        6. Signature: Right side with margin (x: 600), bottom safe zone (y: 450-480)

      For the given certificate category "${category}" and background image, generate 5 unique design variations. Remember:
      - Include 2-3 lines of appreciating textual content (bodyText) that is relevant to the ${category} certificates
      - Position ALL text within the central safe content area, avoiding decorative borders
      - Use colors that contrast well with the background's central area
      - Keep text well within margins to prevent cutoff
      - Complement the background's visual style and color scheme
      - Avoid placing text over busy or decorative background areas
      - Ensure professional appearance and complete text visibility

      IMPORTANT: Return ONLY a valid JSON object without any markdown formatting, code blocks, or additional text. Do not wrap the response in \`\`\`json or any other formatting.
      CRITICAL: For the canvasCode field, provide CLEAN JavaScript code WITHOUT embedded base64 image data. Use placeholder comments for image loading instead of actual base64 strings. Keep the code concise and functional.

      Return a JSON object with the following structure:
      {
        "designs": [
          {
            "id": 1,
            "name": "Design Name",
            "description": "Brief description of the design style",
            "layout": {
              "titlePosition": { "x": number, "y": number },
              "presentationLinePosition": { "x": number, "y": number },
              "recipientNamePosition": { "x": number, "y": number },
              "bodyTextPosition": { "x": number, "y": number },
              "datePosition": { "x": number, "y": number },
              "signaturePosition": { "x": number, "y": number }
            },
            "typography": {
              "titleFont": "font family",
              "titleSize": number,
              "titleColor": "#hexcolor",
              "titleWeight": "normal|bold|lighter",
              "nameFont": "font family", 
              "nameSize": number,
              "nameColor": "#hexcolor",
              "nameWeight": "normal|bold|lighter",
              "bodyFont": "font family",
              "bodySize": number,
              "bodyColor": "#hexcolor",
              "bodyWeight": "normal|bold|lighter"
            },
            "content": {
              "title": "Certificate Title (e.g., Certificate of Achievement, Certificate of Completion)",
              "presentationLine": "Presentation line (e.g., This certificate is proudly presented to, This is to certify that, Awarded to)",
              "bodyText": "Certificate appreciation text in 2-3 lines with appropriate content for the category (e.g., for successfully completing, in recognition of outstanding achievement)",
              "recipientPlaceholder": "[Recipient Name]",
              "datePlaceholder": "[Date]",
              "signaturePlaceholder": "[Signature]"
            },
            "styling": {
              "primaryColor": "#hexcolor",
              "secondaryColor": "#hexcolor",
              "accentColor": "#hexcolor",
              "borderStyle": "none|solid|dashed|dotted",
              "borderWidth": number,
              "borderColor": "#hexcolor",
              "shadowEnabled": boolean,
              "shadowColor": "#hexcolor",
              "shadowBlur": number,
              "shadowOffset": { "x": number, "y": number }
            },
            "canvasCode": "Clean JavaScript code without base64 data"
          }
        ]
      }

      Design Guidelines for Background-Aware Certificates:
      1. ANALYZE THE BACKGROUND: Study the dominant colors, contrast areas, and visual elements
      2. TEXT CONTRAST: Choose colors that provide high contrast against the background
        - For light backgrounds: Use dark colors (#000000, #333333, #1a1a1a)
        - For dark backgrounds: Use light colors (#ffffff, #f5f5f5, #e0e0e0)
        - For colorful backgrounds: Use neutral colors or complementary high-contrast colors
      3. SMART POSITIONING: Place text in areas of the background that are:
        - Within the central content area (safe zone) of the certificate
        - Relatively uniform in color/texture
        - Not overlapping with decorative elements or borders
        - Providing good contrast for readability
        - Well within margins (at least 20% inward from edges for 800x600 canvas)
      4. SAFE ZONE LAYOUT: For standard 800x600 certificate, follow this EXACT order:
        - Title: x: 400 (center), y: 160-180 (upper safe zone)
        - Presentation line: x: 400 (center), y: 210-230 (below title)
        - Recipient name: x: 400 (center), y: 260-280 (prominent middle area)
        - Certificate body: x: 400 (center), y: 340-380 (below recipient name)
        - Date: x: 200 (left safe margin), y: 450-480 (bottom safe zone)
        - Signature: x: 600 (right safe margin), y: 450-480 (bottom safe zone)
      4. COLOR HARMONY: Select accent colors that complement the background's color scheme
      5. TYPOGRAPHY: Choose fonts that match the background's style (elegant fonts for formal backgrounds, modern fonts for contemporary backgrounds)
      6. LAYOUT ADAPTATION: Adjust positioning based on background elements:
        - Avoid busy areas of the background
        - Use background's natural focal points
        - Consider the background's orientation and flow
      7. READABILITY FIRST: Ensure all text is clearly readable - use text shadows, outlines, or background overlays if needed
      8. STYLE CONSISTENCY: Match the design style to the background (formal, modern, artistic, etc.)
      9. Each design should be completely different from the others
      10. Generate clean Canvas.js code without embedded images
      11. Use web-safe fonts like Arial, Times New Roman, Georgia, Helvetica, etc.
      12. Consider adding text shadows or outlines for better readability against complex backgrounds

      The Canvas.js code should include:
      - Drawing the background image (use placeholder: // Background image drawn here)
      - Setting fonts, colors, and styles based on background analysis
      - Drawing text at positions that are WELL WITHIN the safe content area
      - CRITICAL POSITIONING RULES for 800x600 canvas (follow this EXACT order):
        * Title: x: 400, y: 160-180 (centered, upper safe zone)
        * Presentation line: x: 400, y: 210-230 (centered, below title)
        * Recipient name: x: 400, y: 260-280 (centered, prominent middle area)
        * Certificate body: x: 400, y: 340-380 (centered, below recipient name)
        * Date: x: 200, y: 450-480 (left side, bottom safe zone)
        * Signature: x: 600, y: 450-480 (right side, bottom safe zone)
      - Text enhancement techniques for better readability:
        * Text shadows: ctx.shadowColor, ctx.shadowBlur, ctx.shadowOffsetX/Y
        * Text outlines: ctx.strokeStyle, ctx.strokeText()
        * Semi-transparent backgrounds behind text if needed
      - Any decorative elements like borders or shadows that complement the background
      - Clean, executable code without base64 data
      - Contrast-aware color choices based on background analysis
      - NEVER place text closer than 160px from left/right edges or 120px from top/bottom edges

      EXAMPLES of good text contrast techniques:
      - For light backgrounds: Use dark text (#000000 to #333333)
      - For dark backgrounds: Use light text (#ffffff to #f0f0f0)  
      - For busy backgrounds: Add text shadows or outlines for separation
      - For colorful backgrounds: Use neutral colors with high contrast

      IMPORTANT: Do not include base64 image data in the canvasCode field. Use comments like "// Background image loaded here" instead.
      Make sure all designs are professional, visually distinct, and suitable for official certificates.
      Return the JSON object directly without any formatting or additional text.`;

      const imagePart = {
        inlineData: {
          data: imageData.split(',')[1],
          mimeType: 'image/jpeg'
        }
      };

      const result = await model.generateContent([systemPrompt, imagePart]);
      const response = await result.response;
      const text = response.text();

      // Parse the JSON response
      try {
        const cleanJson = extractJsonFromMarkdown(text);
        const designData = JSON.parse(cleanJson);
        
        // Validate the structure
        if (!designData.designs || !Array.isArray(designData.designs) || designData.designs.length === 0) {
          throw new Error('Invalid response structure: missing or empty designs array');
        }
        
        // Validate and clean each design
        for (const design of designData.designs) {
          if (!design.id || !design.name || !design.layout || !design.typography || !design.content) {
            throw new Error('Invalid design structure: missing required fields');
          }
          
          // Clean up canvas code if it contains problematic content
          if (design.canvasCode && typeof design.canvasCode === 'string') {
            design.canvasCode = design.canvasCode.replace(
              /data:image\/[^'";,\s]*/g,
              '/* Background image data removed for safety */'
            );
            
            if (design.canvasCode.length > 2000) {
              design.canvasCode = design.canvasCode.substring(0, 2000) + '\n// Code truncated for safety';
            }
          }
        }
        
        console.log('Successfully parsed and validated Gemini response');
        return NextResponse.json(designData);
      } catch (parseError) {
        console.error('Error parsing Gemini response:', parseError);
        console.error('Raw response:', text);
        console.log('Falling back to default designs');
        return NextResponse.json({ designs: fallbackDesigns });
      }

    } catch (geminiError) {
      console.error('Error with Gemini API:', geminiError);
      console.log('Falling back to default designs');
      return NextResponse.json({ designs: fallbackDesigns });
    }

  } catch (error) {
    console.error('Error generating designs:', error);
    return NextResponse.json(
      { error: 'Failed to generate designs' },
      { status: 500 }
    );
  }
}
