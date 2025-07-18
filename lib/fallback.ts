import { CertificateDesign } from '@/types/certificate';

export const fallbackDesigns: CertificateDesign[] = [
  {
    id: 1,
    name: "Classic Elegant",
    description: "Traditional formal certificate with serif typography and high contrast",
    layout: {
      titlePosition: { x: 400, y: 120 },
      presentationLinePosition: { x: 400, y: 180 },
      recipientNamePosition: { x: 400, y: 250 },
      bodyTextPosition: { x: 400, y: 320 },
      datePosition: { x: 200, y: 470 },
      signaturePosition: { x: 600, y: 470 }
    },
    typography: {
      titleFont: "Georgia",
      titleSize: 48,
      titleColor: "#000000",
      titleWeight: "bold",
      nameFont: "Georgia",
      nameSize: 36,
      nameColor: "#1a1a1a",
      nameWeight: "bold",
      bodyFont: "Georgia",
      bodySize: 18,
      bodyColor: "#333333",
      bodyWeight: "normal"
    },
    content: {
      title: "Certificate of Achievement",
      presentationLine: "This is to certify that",
      bodyText: "has demonstrated exceptional skills and dedication\nand is hereby recognized for outstanding achievement.",
      recipientPlaceholder: "[Recipient Name]",
      datePlaceholder: "[Date]",
      signaturePlaceholder: "[Signature]"
    },
    styling: {
      primaryColor: "#000000",
      secondaryColor: "#1a1a1a",
      accentColor: "#d69e2e",
      borderStyle: "solid",
      borderWidth: 3,
      borderColor: "#d69e2e",
      shadowEnabled: true,
      shadowColor: "rgba(255,255,255,0.8)",
      shadowBlur: 2,
      shadowOffset: { x: 1, y: 1 }
    },
    canvasCode: `// Classic Elegant Certificate Design
const canvas = document.getElementById('certificateCanvas');
const ctx = canvas.getContext('2d');

// Clear canvas
ctx.clearRect(0, 0, canvas.width, canvas.height);

// Background image loaded here
// ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

// Set shadow
ctx.shadowColor = 'rgba(255,255,255,0.8)';
ctx.shadowBlur = 2;
ctx.shadowOffsetX = 1;
ctx.shadowOffsetY = 1;

// Draw title
ctx.font = 'bold 48px Georgia';
ctx.fillStyle = '#000000';
ctx.textAlign = 'center';
ctx.fillText('Certificate of Achievement', 400, 120);

// Draw presentation line
ctx.font = 'normal 18px Georgia';
ctx.fillStyle = '#333333';
ctx.fillText('This is to certify that', 400, 180);

// Draw recipient name
ctx.font = 'bold 36px Georgia';
ctx.fillStyle = '#1a1a1a';
ctx.fillText('[Recipient Name]', 400, 250);

// Draw body text
ctx.font = 'normal 18px Georgia';
ctx.fillStyle = '#333333';
ctx.fillText('has demonstrated exceptional skills and dedication', 400, 300);
ctx.fillText('and is hereby recognized for outstanding achievement.', 400, 340);

// Draw date
ctx.font = 'normal 18px Georgia';
ctx.textAlign = 'left';
ctx.fillText('[Date]', 200, 470);

// Draw signature
ctx.textAlign = 'right';
ctx.fillText('[Signature]', 600, 470);

// Draw border
ctx.setLineDash([]);
ctx.strokeStyle = '#d69e2e';
ctx.lineWidth = 3;
ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

// Reset shadow
ctx.shadowColor = 'transparent';`
  },
  {
    id: 2,
    name: "Modern Minimalist",
    description: "Clean contemporary design with high-contrast sans-serif fonts",
    layout: {
      titlePosition: { x: 400, y: 100 },
      presentationLinePosition: { x: 400, y: 160 },
      recipientNamePosition: { x: 400, y: 220 },
      bodyTextPosition: { x: 400, y: 290 },
      datePosition: { x: 200, y: 450 },
      signaturePosition: { x: 600, y: 450 }
    },
    typography: {
      titleFont: "Arial",
      titleSize: 42,
      titleColor: "#000000",
      titleWeight: "bold",
      nameFont: "Arial",
      nameSize: 32,
      nameColor: "#1a1a1a",
      nameWeight: "bold",
      bodyFont: "Arial",
      bodySize: 16,
      bodyColor: "#333333",
      bodyWeight: "normal"
    },
    content: {
      title: "Certificate of Completion",
      presentationLine: "Awarded to",
      bodyText: "for successfully completing the program\nwith dedication and excellence.",
      recipientPlaceholder: "[Recipient Name]",
      datePlaceholder: "[Date]",
      signaturePlaceholder: "[Signature]"
    },
    styling: {
      primaryColor: "#000000",
      secondaryColor: "#1a1a1a",
      accentColor: "#3182ce",
      borderStyle: "none",
      borderWidth: 0,
      borderColor: "#e2e8f0",
      shadowEnabled: true,
      shadowColor: "rgba(255,255,255,0.7)",
      shadowBlur: 1,
      shadowOffset: { x: 1, y: 1 }
    },
    canvasCode: `// Modern Minimalist Certificate Design
const canvas = document.getElementById('certificateCanvas');
const ctx = canvas.getContext('2d');

// Clear canvas
ctx.clearRect(0, 0, canvas.width, canvas.height);

// Background image loaded here
// ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

// Draw title
ctx.font = 'bold 42px Arial';
ctx.fillStyle = '#000000';
ctx.textAlign = 'center';
ctx.fillText('Certificate of Completion', 400, 100);

// Draw presentation line
ctx.font = 'normal 16px Arial';
ctx.fillStyle = '#333333';
ctx.fillText('Awarded to', 400, 160);

// Draw recipient name
ctx.font = 'bold 32px Arial';
ctx.fillStyle = '#1a1a1a';
ctx.fillText('[Recipient Name]', 400, 220);

// Draw body text
ctx.font = 'normal 16px Arial';
ctx.fillStyle = '#333333';
ctx.fillText('for successfully completing the program', 400, 270);
ctx.fillText('with dedication and excellence.', 400, 310);

// Draw date
ctx.font = 'normal 16px Arial';
ctx.textAlign = 'left';
ctx.fillText('[Date]', 200, 450);

// Draw signature
ctx.textAlign = 'right';
ctx.fillText('[Signature]', 600, 450);`
  },
  {
    id: 3,
    name: "Luxurious Gold",
    description: "Premium certificate with gold accents and high contrast text",
    layout: {
      titlePosition: { x: 400, y: 130 },
      presentationLinePosition: { x: 400, y: 190 },
      recipientNamePosition: { x: 400, y: 260 },
      bodyTextPosition: { x: 400, y: 330 },
      datePosition: { x: 200, y: 480 },
      signaturePosition: { x: 600, y: 480 }
    },
    typography: {
      titleFont: "Times New Roman",
      titleSize: 44,
      titleColor: "#000000",
      titleWeight: "bold",
      nameFont: "Times New Roman",
      nameSize: 38,
      nameColor: "#1a1a1a",
      nameWeight: "bold",
      bodyFont: "Times New Roman",
      bodySize: 20,
      bodyColor: "#333333",
      bodyWeight: "normal"
    },
    content: {
      title: "Certificate of Excellence",
      presentationLine: "Presented to",
      bodyText: "in recognition of outstanding achievement\nand exemplary performance.",
      recipientPlaceholder: "[Recipient Name]",
      datePlaceholder: "[Date]",
      signaturePlaceholder: "[Signature]"
    },
    styling: {
      primaryColor: "#000000",
      secondaryColor: "#1a1a1a",
      accentColor: "#d69e2e",
      borderStyle: "solid",
      borderWidth: 4,
      borderColor: "#b7791f",
      shadowEnabled: true,
      shadowColor: "rgba(255,255,255,0.8)",
      shadowBlur: 2,
      shadowOffset: { x: 1, y: 1 }
    },
    canvasCode: `// Luxurious Gold Certificate Design
const canvas = document.getElementById('certificateCanvas');
const ctx = canvas.getContext('2d');

// Clear canvas
ctx.clearRect(0, 0, canvas.width, canvas.height);

// Background image loaded here
// ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

// Draw title
ctx.font = 'bold 44px Times New Roman';
ctx.fillStyle = '#000000';
ctx.textAlign = 'center';
ctx.fillText('Certificate of Excellence', 400, 130);

// Draw presentation line
ctx.font = 'normal 20px Times New Roman';
ctx.fillStyle = '#333333';
ctx.fillText('Presented to', 400, 190);

// Draw recipient name
ctx.font = 'bold 38px Times New Roman';
ctx.fillStyle = '#1a1a1a';
ctx.fillText('[Recipient Name]', 400, 260);

// Draw body text
ctx.font = 'normal 20px Times New Roman';
ctx.fillStyle = '#333333';
ctx.fillText('in recognition of outstanding achievement', 400, 310);
ctx.fillText('and exemplary performance.', 400, 350);

// Draw date
ctx.font = 'normal 20px Times New Roman';
ctx.textAlign = 'left';
ctx.fillText('[Date]', 200, 480);

// Draw signature
ctx.textAlign = 'right';
ctx.fillText('[Signature]', 600, 480);

// Draw border
ctx.setLineDash([]);
ctx.strokeStyle = '#b7791f';
ctx.lineWidth = 4;
ctx.strokeRect(15, 15, canvas.width - 30, canvas.height - 30);`
  },
  {
    id: 4,
    name: "Creative Artistic",
    description: "Artistic design with high-contrast creative typography",
    layout: {
      titlePosition: { x: 400, y: 110 },
      presentationLinePosition: { x: 400, y: 170 },
      recipientNamePosition: { x: 400, y: 240 },
      bodyTextPosition: { x: 400, y: 310 },
      datePosition: { x: 200, y: 460 },
      signaturePosition: { x: 600, y: 460 }
    },
    typography: {
      titleFont: "Helvetica",
      titleSize: 40,
      titleColor: "#000000",
      titleWeight: "bold",
      nameFont: "Helvetica",
      nameSize: 34,
      nameColor: "#1a1a1a",
      nameWeight: "bold",
      bodyFont: "Helvetica",
      bodySize: 18,
      bodyColor: "#333333",
      bodyWeight: "normal"
    },
    content: {
      title: "Creative Achievement Award",
      presentationLine: "Congratulations to",
      bodyText: "for exceptional creativity and innovation\nin the field of arts and design.",
      recipientPlaceholder: "[Recipient Name]",
      datePlaceholder: "[Date]",
      signaturePlaceholder: "[Signature]"
    },
    styling: {
      primaryColor: "#000000",
      secondaryColor: "#1a1a1a",
      accentColor: "#805ad5",
      borderStyle: "dashed",
      borderWidth: 2,
      borderColor: "#805ad5",
      shadowEnabled: true,
      shadowColor: "rgba(255,255,255,0.7)",
      shadowBlur: 2,
      shadowOffset: { x: 1, y: 1 }
    },
    canvasCode: `// Creative Artistic Certificate Design
const canvas = document.getElementById('certificateCanvas');
const ctx = canvas.getContext('2d');

// Clear canvas
ctx.clearRect(0, 0, canvas.width, canvas.height);

// Background image loaded here
// ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

// Draw title
ctx.font = 'bold 40px Helvetica';
ctx.fillStyle = '#000000';
ctx.textAlign = 'center';
ctx.fillText('Creative Achievement Award', 400, 110);

// Draw presentation line
ctx.font = 'normal 18px Helvetica';
ctx.fillStyle = '#333333';
ctx.fillText('Congratulations to', 400, 170);

// Draw recipient name
ctx.font = 'bold 34px Helvetica';
ctx.fillStyle = '#1a1a1a';
ctx.fillText('[Recipient Name]', 400, 240);

// Draw body text
ctx.font = 'normal 18px Helvetica';
ctx.fillStyle = '#333333';
ctx.fillText('for exceptional creativity and innovation', 400, 290);
ctx.fillText('in the field of arts and design.', 400, 330);

// Draw date
ctx.font = 'normal 18px Helvetica';
ctx.textAlign = 'left';
ctx.fillText('[Date]', 200, 460);

// Draw signature
ctx.textAlign = 'right';
ctx.fillText('[Signature]', 600, 460);

// Draw border
ctx.setLineDash([5, 5]);
ctx.strokeStyle = '#805ad5';
ctx.lineWidth = 2;
ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
ctx.setLineDash([]);`
  },
  {
    id: 5,
    name: "Corporate Professional",
    description: "Business-oriented design with high-contrast professional layout",
    layout: {
      titlePosition: { x: 400, y: 140 },
      presentationLinePosition: { x: 400, y: 200 },
      recipientNamePosition: { x: 400, y: 270 },
      bodyTextPosition: { x: 400, y: 340 },
      datePosition: { x: 200, y: 490 },
      signaturePosition: { x: 600, y: 490 }
    },
    typography: {
      titleFont: "Arial",
      titleSize: 46,
      titleColor: "#000000",
      titleWeight: "bold",
      nameFont: "Arial",
      nameSize: 36,
      nameColor: "#1a1a1a",
      nameWeight: "bold",
      bodyFont: "Arial",
      bodySize: 19,
      bodyColor: "#333333",
      bodyWeight: "normal"
    },
    content: {
      title: "Professional Certificate",
      presentationLine: "This certifies that",
      bodyText: "has successfully completed professional training\nand meets all certification requirements.",
      recipientPlaceholder: "[Recipient Name]",
      datePlaceholder: "[Date]",
      signaturePlaceholder: "[Signature]"
    },
    styling: {
      primaryColor: "#000000",
      secondaryColor: "#1a1a1a",
      accentColor: "#3182ce",
      borderStyle: "solid",
      borderWidth: 5,
      borderColor: "#3182ce",
      shadowEnabled: true,
      shadowColor: "rgba(255,255,255,0.7)",
      shadowBlur: 1,
      shadowOffset: { x: 1, y: 1 }
    },
    canvasCode: `// Corporate Professional Certificate Design
const canvas = document.getElementById('certificateCanvas');
const ctx = canvas.getContext('2d');

// Clear canvas
ctx.clearRect(0, 0, canvas.width, canvas.height);

// Background image loaded here
// ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

// Draw title
ctx.font = 'bold 46px Arial';
ctx.fillStyle = '#000000';
ctx.textAlign = 'center';
ctx.fillText('Professional Certificate', 400, 140);

// Draw presentation line
ctx.font = 'normal 19px Arial';
ctx.fillStyle = '#333333';
ctx.fillText('This certifies that', 400, 200);

// Draw recipient name
ctx.font = 'bold 36px Arial';
ctx.fillStyle = '#1a1a1a';
ctx.fillText('[Recipient Name]', 400, 270);

// Draw body text
ctx.font = 'normal 19px Arial';
ctx.fillStyle = '#333333';
ctx.fillText('has successfully completed professional training', 400, 320);
ctx.fillText('and meets all certification requirements.', 400, 360);

// Draw date
ctx.font = 'normal 19px Arial';
ctx.textAlign = 'left';
ctx.fillText('[Date]', 200, 490);

// Draw signature
ctx.textAlign = 'right';
ctx.fillText('[Signature]', 600, 490);

// Draw border
ctx.setLineDash([]);
ctx.strokeStyle = '#3182ce';
ctx.lineWidth = 5;
ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);`
  }
];
