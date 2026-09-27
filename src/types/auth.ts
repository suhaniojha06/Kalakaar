export interface AuthProfile {
  id: number;
  name: string;
  location: string;
  cluster: string;
  avatar_url: string;
  verified: boolean;
  is_default: boolean;
}

export interface AuthSession {
  token: string;
  profile: AuthProfile;
}

export interface CatalogPost {
  id: number;
  user_id: number;
  title: string;
  content: string;
  category: string;
  status: string;
  image_url: string;
  price: number;
  created_at: string;
}

export const DEFAULT_PROFILE: AuthProfile = {
  id: 1,
  name: 'Ram Charan',
  location: 'Machilipatnam, Andhra Pradesh',
  cluster: 'Kalamkari Cluster, AP',
  avatar_url:
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
  verified: true,
  is_default: true,
};
