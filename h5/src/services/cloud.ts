export type Ingredient = { name: string; quantity?: number; unit?: string };
export type DishCloud = {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  imageUrl?: string;
  ingredients?: Ingredient[];
  instructions?: string[];
};
export type OrgCloud = {
  id: string;
  name: string;
  logoUrl?: string;
  coverUrl?: string;
  code?: string; // 加入口令/邀请码
  members?: { id: string; nickname: string }[];
};

const BASE = import.meta.env?.BASE_URL || '/whattoeat/';

async function fetchJSON<T>(path: string): Promise<T> {
  const url = `${BASE}${path}`.replace(/\/+/, '/');
  const res = await fetch(url, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`Fetch failed: ${url} ${res.status}`);
  return res.json() as Promise<T>;
}

// 云端菜品数据
export async function fetchDishes(): Promise<DishCloud[]> {
  try {
    const data = await fetchJSON<DishCloud[]>(`data/dishes.json`);
    return data;
  } catch (e) {
    console.warn('fetchDishes fallback, using empty list', e);
    return [];
  }
}

// 组织数据（示例：仅本地持久化模拟）
const LS_ORGS_KEY = 'whattoeat.orgs';
const LS_CURRENT_ORG_KEY = 'whattoeat.currentOrgId';

export async function fetchOrgs(): Promise<OrgCloud[]> {
  const raw = localStorage.getItem(LS_ORGS_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw) as OrgCloud[]; } catch { return []; }
}

export async function saveOrgs(orgs: OrgCloud[]): Promise<void> {
  localStorage.setItem(LS_ORGS_KEY, JSON.stringify(orgs));
}

export async function createOrg(name: string, logoUrl?: string, coverUrl?: string): Promise<OrgCloud> {
  const orgs = await fetchOrgs();
  const org: OrgCloud = {
    id: `org_${Date.now()}`,
    name,
    logoUrl,
    coverUrl,
    code: Math.random().toString(36).slice(2, 8).toUpperCase(),
    members: []
  };
  orgs.push(org);
  await saveOrgs(orgs);
  localStorage.setItem(LS_CURRENT_ORG_KEY, org.id);
  return org;
}

export async function joinOrgByCode(code: string, nickname: string): Promise<OrgCloud | null> {
  const orgs = await fetchOrgs();
  const org = orgs.find(o => o.code === code.trim());
  if (!org) return null;
  const uid = `u_${Date.now()}`;
  org.members = org.members || [];
  org.members.push({ id: uid, nickname });
  await saveOrgs(orgs);
  localStorage.setItem(LS_CURRENT_ORG_KEY, org.id);
  return org;
}

export async function getCurrentOrg(): Promise<OrgCloud | null> {
  const id = localStorage.getItem(LS_CURRENT_ORG_KEY);
  if (!id) return null;
  const orgs = await fetchOrgs();
  return orgs.find(o => o.id === id) || null;
}