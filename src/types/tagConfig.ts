export interface TagConfig {
  id: string;
  display: string;
  category: string;
  description: string;
  priority: number;
  status: string;
  level_cache: number;
  has_children: boolean;
  resource: string;
  facility: string | null;
}

export interface TagConfigListResponse {
  count: number;
  results: TagConfig[];
}
