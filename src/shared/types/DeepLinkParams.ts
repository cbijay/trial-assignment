export interface DeepLinkParams {
  itemId?: string;
  userId?: string;
  action?: 'view' | 'save' | 'share';
  source?: 'notification' | 'qr' | 'web' | 'app';
  [key: string]: string | undefined;
}

export interface ParsedDeepLink {
  isValid: boolean;
  params: DeepLinkParams;
  error?: string;
}

export interface DeepLinkConfig {
  scheme: string;
  host?: string;
  paths: Record<
    string,
    {
      params: string[];
      required: string[];
    }
  >;
}
