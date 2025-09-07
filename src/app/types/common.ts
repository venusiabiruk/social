export interface Brand {
  businessName: string;
  businessType: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoUrl?: string;
  defaultHashtags: string[];
  brandVoice: string;
  targetAudience: string;
}
export interface Draft {
  id: string;
  caption: string;
  hashtags: string[];
  imageUrl?: string;
  videoUrl?: string;
  platform: string;
  contentType: string;
  title: string;
}