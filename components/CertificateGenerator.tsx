'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Download, Copy, Loader2, Code } from 'lucide-react';
import { CertificateDesign, DesignResponse, CertificateFormData } from '@/types/certificate';
import { generateSampleBackground, downloadSampleBackground } from '@/lib/background';
import { validateImageFile, resizeImage } from '@/lib/certificate-utils';

const CertificateGenerator: React.FC = () => {
  const [category, setCategory] = useState('');
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
  const [backgroundImagePreview, setBackgroundImagePreview] = useState<string>('');
  const [formData, setFormData] = useState<CertificateFormData>({
    category: '',
    recipientName: '',
    date: '',
    signature: ''
  });
  const [designs, setDesigns] = useState<CertificateDesign[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedCode, setCopiedCode] = useState<number | null>(null);
  const [error, setError] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!validateImageFile(file)) {
        return;
      }
      
      setBackgroundImage(file);
      setError('');
      
      try {
        const resizedImage = await resizeImage(file);
        setBackgroundImagePreview(resizedImage);
      } catch (err) {
        console.error('Error processing image:', err);
        setError('Failed to process image. Please try again.');
      }
    }
  };

  const generateSampleBg = () => {
    const sampleBg = generateSampleBackground();
    setBackgroundImagePreview(sampleBg);
    setBackgroundImage(null);
  };

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const generateDesigns = async () => {
    if (!category || !backgroundImagePreview) {
      setError('Please provide both category and background image');
      return;
    }

    setIsGenerating(true);
    setError('');
    
    try {
      let imageData = backgroundImagePreview;
      
      // Convert to base64
      if (backgroundImage) {
        imageData = await convertImageToBase64(backgroundImage);
      }
      
      const response = await fetch('/api/generate-designs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category,
          imageData
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate designs');
      }

      const data: DesignResponse = await response.json();
      setDesigns(data.designs);
      setFormData(prev => ({ ...prev, category }));
    } catch (error) {
      console.error('Error generating designs:', error);
      setError('Failed to generate designs. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const drawCertificateContent = useCallback((ctx: CanvasRenderingContext2D, design: CertificateDesign) => {
    const { layout, typography, content, styling } = design;
    
    const safeZone = {
      left: 160,
      right: 640,
      top: 120,
      bottom: 480,
      centerX: 400
    };
    
    const adjustToSafeZone = (x: number, y: number, textWidth: number = 0) => {
      const adjustedX = Math.max(safeZone.left + textWidth/2, Math.min(safeZone.right - textWidth/2, x));
      const adjustedY = Math.max(safeZone.top, Math.min(safeZone.bottom, y));
      return { x: adjustedX, y: adjustedY };
    };
    
    const drawTextWithContrast = (text: string, x: number, y: number, fontSize: number, fontWeight: string, fontFamily: string, color: string) => {
      ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
      
      const textMetrics = ctx.measureText(text);
      const textWidth = textMetrics.width;
      const adjustedPos = adjustToSafeZone(x, y, textWidth);
      const isLightColor = isColorLight(color);
      const outlineColor = isLightColor ? '#000000' : '#ffffff';
      
      ctx.strokeStyle = outlineColor;
      ctx.lineWidth = Math.max(1, fontSize / 25);
      ctx.strokeText(text, adjustedPos.x, adjustedPos.y);
      ctx.fillStyle = color;
      ctx.fillText(text, adjustedPos.x, adjustedPos.y);
    };
    
    const isColorLight = (color: string): boolean => {
      const hex = color.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness > 128;
    };
    
    if (styling.shadowEnabled) {
      ctx.shadowColor = styling.shadowColor;
      ctx.shadowBlur = styling.shadowBlur;
      ctx.shadowOffsetX = styling.shadowOffset.x;
      ctx.shadowOffsetY = styling.shadowOffset.y;
    }

    ctx.textAlign = 'center';
    const titleY = Math.max(safeZone.top + 40, Math.min(180, layout.titlePosition.y));
    drawTextWithContrast(
      content.title,
      safeZone.centerX,
      titleY,
      typography.titleSize,
      typography.titleWeight,
      typography.titleFont,
      typography.titleColor
    );

    ctx.textAlign = 'center';
    const presentationY = Math.max(titleY + 50, Math.min(220, layout.presentationLinePosition.y));
    drawTextWithContrast(
      content.presentationLine,
      safeZone.centerX,
      presentationY,
      typography.bodySize,
      typography.bodyWeight,
      typography.bodyFont,
      typography.bodyColor
    );

    ctx.textAlign = 'center';
    const nameY = Math.max(presentationY + 40, Math.min(280, layout.recipientNamePosition.y));
    drawTextWithContrast(
      formData.recipientName || content.recipientPlaceholder,
      safeZone.centerX,
      nameY,
      typography.nameSize,
      typography.nameWeight,
      typography.nameFont,
      typography.nameColor
    );

    ctx.textAlign = 'center';
    const bodyY = Math.max(nameY + 60, Math.min(360, layout.bodyTextPosition.y));
    const bodyLines = content.bodyText.split('\n');
    bodyLines.forEach((line, i) => {
      const lineY = bodyY + (i * (typography.bodySize + 5));
      drawTextWithContrast(
        line,
        safeZone.centerX,
        lineY,
        typography.bodySize,
        typography.bodyWeight,
        typography.bodyFont,
        typography.bodyColor
      );
    });

    const lastBodyLineIndex = Math.max(0, bodyLines.length - 1);
    const lastBodyLineY = bodyY + (lastBodyLineIndex * (typography.bodySize + 5));
    const dateSignatureY = Math.max(lastBodyLineY + 60, Math.min(safeZone.bottom - 20, layout.datePosition.y));

    ctx.textAlign = 'left';
    drawTextWithContrast(
      formData.date || content.datePlaceholder,
      safeZone.left + 40,
      dateSignatureY,
      typography.bodySize,
      typography.bodyWeight,
      typography.bodyFont,
      typography.bodyColor
    );

    ctx.textAlign = 'right';
    drawTextWithContrast(
      formData.signature || content.signaturePlaceholder,
      safeZone.right - 40,
      dateSignatureY,
      typography.bodySize,
      typography.bodyWeight,
      typography.bodyFont,
      typography.bodyColor
    );

    if (styling.borderStyle !== 'none') {
      ctx.setLineDash(styling.borderStyle === 'dashed' ? [5, 5] : []);
      ctx.strokeStyle = styling.borderColor;
      ctx.lineWidth = styling.borderWidth;
      ctx.strokeRect(20, 20, ctx.canvas.width - 40, ctx.canvas.height - 40);
      ctx.setLineDash([]);
    }

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.lineWidth = 1;
  }, [formData]);

  const renderCertificate = useCallback((design: CertificateDesign, index: number) => {
    const canvas = canvasRefs.current[index];
    if (!canvas || !backgroundImagePreview) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Load and draw background image
    const img = document.createElement('img');
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Draw certificate content based on design
      drawCertificateContent(ctx, design);
    };
    img.src = backgroundImagePreview;
  }, [backgroundImagePreview, drawCertificateContent]);

  const copyToClipboard = async (code: string, index: number) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(index);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  const downloadCertificate = (index: number) => {
    const canvas = canvasRefs.current[index];
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `certificate-design-${index + 1}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  useEffect(() => {
    if (designs.length > 0 && backgroundImagePreview) {
      designs.forEach((design, index) => {
        setTimeout(() => renderCertificate(design, index), index * 100);
      });
    }
  }, [designs, backgroundImagePreview, formData, renderCertificate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-2">
            PrismAI
          </h1>
          <p className="text-gray-400">Generate certificate designs with Canvas.js powered by AI</p>
        </div>

        {/* Input Section */}
        <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-600 rounded-xl mb-8 p-8">
          <CardContent className="space-y-8 p-0">          
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="category" className="text-white text-lg font-medium mb-3 block">Certificate Category</Label>
                  <Input
                    id="category"
                    placeholder=""
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="bg-gray-700/50 border-gray-500 text-white h-12 rounded-xl text-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="recipient" className="text-white text-lg font-medium mb-3 block">Awardee Name</Label>
                  <Input
                    id="recipient"
                    placeholder=""
                    value={formData.recipientName}
                    onChange={(e) => setFormData(prev => ({ ...prev, recipientName: e.target.value }))}
                    className="bg-gray-700/50 border-gray-500 text-white h-12 rounded-xl text-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="date" className="text-white text-lg font-medium mb-3 block">Date of Issue</Label>
                  <Input
                    id="date"
                    placeholder=""
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="bg-gray-700/50 border-gray-500 text-white h-12 rounded-xl text-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="signature" className="text-white text-lg font-medium mb-3 block">Issued By</Label>
                  <Input
                    id="signature"
                    placeholder=""
                    value={formData.signature}
                    onChange={(e) => setFormData(prev => ({ ...prev, signature: e.target.value }))}
                    className="bg-gray-700/50 border-gray-500 text-white h-12 rounded-xl text-lg"
                  />
                </div>
              </div>

              {/* Certificate Background Upload */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-white text-lg font-medium">Upload Certificate Background</Label>
                  <div className="flex items-center gap-2">
                    <Upload className="w-5 h-5 text-gray-400" />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={generateSampleBg}
                      className="border-gray-500 text-gray-300 hover:bg-gray-600 rounded-lg px-4 py-2"
                    >
                      Sample
                    </Button>
                  </div>
                </div>
                <div 
                  className="border-2 border-dashed border-gray-500 rounded-xl h-64 flex flex-col items-center justify-center bg-gray-700/30 cursor-pointer hover:bg-gray-700/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {backgroundImagePreview ? (
                    <div className="relative w-full h-full">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={backgroundImagePreview}
                        alt="Background preview"
                        className="w-full h-full object-cover rounded-xl"
                      />
                      <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-lg text-sm font-medium">
                        Uploaded
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-gray-400 text-lg mb-2">Click here to upload</div>
                      <div className="text-gray-500 text-sm">Supports: JPG, PNG, GIF</div>
                    </div>
                  )}
                  <Input
                    type="file"
                    id="background"
                    accept="image/*"
                    onChange={handleImageUpload}
                    ref={fileInputRef}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            {/* Generate Button */}
            <div className="pt-4">
              <Button
                onClick={generateDesigns}
                disabled={!category || !backgroundImagePreview || isGenerating}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-14 rounded-xl text-lg font-medium"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating Designs...
                  </>
                ) : (
                  'Generate Designs'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Certificate Preview area */}
        {designs.length > 0 && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-center text-white">Generated Designs</h2>
            {designs.map((design, index) => (
              <Card key={design.id} className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <span>{design.name}</span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadCertificate(index)}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardTitle>
                  <p className="text-gray-400">{design.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Canvas Preview */}
                  <div className="flex justify-center">
                    <canvas
                      ref={(el) => {
                        canvasRefs.current[index] = el;
                      }}
                      width={800}
                      height={600}
                      className="border border-gray-600 rounded-lg max-w-full h-auto"
                    />
                  </div>

                  {/* Canvas Code */}
                  <div className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-white flex items-center gap-2">
                        <Code className="w-4 h-4" />
                        Canvas.js Code
                      </Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(design.canvasCode, index)}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        {copiedCode === index ? (
                          <span className="text-green-400">Copied!</span>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Code
                          </>
                        )}
                      </Button>
                    </div>
                    <Textarea
                      value={design.canvasCode}
                      readOnly
                      className="bg-gray-900 border-gray-600 text-green-400 font-mono text-sm h-40 resize-none"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateGenerator;
