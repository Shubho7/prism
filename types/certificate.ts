export interface Position {
  x: number;
  y: number;
}

export interface Layout {
  titlePosition: Position;
  presentationLinePosition: Position;
  recipientNamePosition: Position;
  bodyTextPosition: Position;
  datePosition: Position;
  signaturePosition: Position;
}

export interface Typography {
  titleFont: string;
  titleSize: number;
  titleColor: string;
  titleWeight: 'normal' | 'bold' | 'lighter';
  nameFont: string;
  nameSize: number;
  nameColor: string;
  nameWeight: 'normal' | 'bold' | 'lighter';
  bodyFont: string;
  bodySize: number;
  bodyColor: string;
  bodyWeight: 'normal' | 'bold' | 'lighter';
}

export interface Content {
  title: string;
  presentationLine: string;
  bodyText: string;
  recipientPlaceholder: string;
  datePlaceholder: string;
  signaturePlaceholder: string;
}

export interface Styling {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  borderStyle: 'none' | 'solid' | 'dashed' | 'dotted';
  borderWidth: number;
  borderColor: string;
  shadowEnabled: boolean;
  shadowColor: string;
  shadowBlur: number;
  shadowOffset: Position;
}

export interface CertificateDesign {
  id: number;
  name: string;
  description: string;
  layout: Layout;
  typography: Typography;
  content: Content;
  styling: Styling;
  canvasCode: string;
}

export interface DesignResponse {
  designs: CertificateDesign[];
}

export interface CertificateFormData {
  category: string;
  recipientName: string;
  date: string;
  signature: string;
}
