export const generateSampleBackground = (width: number = 800, height: number = 600): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return '';
  
  canvas.width = width;
  canvas.height = height;
  
  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#f8fafc');
  gradient.addColorStop(0.5, '#e2e8f0');
  gradient.addColorStop(1, '#cbd5e1');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // Add decorative border
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 8;
  ctx.strokeRect(20, 20, width - 40, height - 40);
  
  // Add inner border
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 40, width - 80, height - 80);
  
  // Add decorative corner elements
  const cornerSize = 40;
  ctx.fillStyle = '#475569';
  
  // Top-left corner
  ctx.beginPath();
  ctx.moveTo(40, 40);
  ctx.lineTo(40 + cornerSize, 40);
  ctx.lineTo(40, 40 + cornerSize);
  ctx.closePath();
  ctx.fill();
  
  // Top-right corner
  ctx.beginPath();
  ctx.moveTo(width - 40, 40);
  ctx.lineTo(width - 40 - cornerSize, 40);
  ctx.lineTo(width - 40, 40 + cornerSize);
  ctx.closePath();
  ctx.fill();
  
  // Bottom-left corner
  ctx.beginPath();
  ctx.moveTo(40, height - 40);
  ctx.lineTo(40 + cornerSize, height - 40);
  ctx.lineTo(40, height - 40 - cornerSize);
  ctx.closePath();
  ctx.fill();
  
  // Bottom-right corner
  ctx.beginPath();
  ctx.moveTo(width - 40, height - 40);
  ctx.lineTo(width - 40 - cornerSize, height - 40);
  ctx.lineTo(width - 40, height - 40 - cornerSize);
  ctx.closePath();
  ctx.fill();
  
  return canvas.toDataURL('image/png');
};

export const downloadSampleBackground = () => {
  const dataUrl = generateSampleBackground();
  const link = document.createElement('a');
  link.download = 'sample-certificate-background.png';
  link.href = dataUrl;
  link.click();
};
