import { defineStore } from 'pinia';
import { createOrg, joinOrgByCode, getCurrentOrg, fetchOrgs, type OrgCloud } from '../services/cloud';

export const useOrgStore = defineStore('org', {
  state: () => ({
    orgs: [] as OrgCloud[],
    current: null as OrgCloud | null,
    loading: false,
    error: ''
  }),
  actions: {
    async init(){
      this.loading = true; this.error = '';
      try {
        this.orgs = await fetchOrgs();
        this.current = await getCurrentOrg();
      } catch (e) {
        this.error = e instanceof Error ? e.message : String(e);
      } finally { this.loading = false; }
    },
    async create(name: string, logoUrl?: string, coverUrl?: string){
      this.loading = true; this.error = '';
      try {
        const org = await createOrg(name, logoUrl, coverUrl);
        this.orgs.push(org);
        this.current = org;
        return org;
      } catch (e) {
        this.error = e instanceof Error ? e.message : String(e);
        return null;
      } finally { this.loading = false; }
    },
    async join(code: string, nickname: string){
      this.loading = true; this.error = '';
      try {
        const org = await joinOrgByCode(code, nickname);
        if (org) { this.current = org; await this.init(); }
        return org;
      } catch (e) {
        this.error = e instanceof Error ? e.message : String(e);
        return null;
      } finally { this.loading = false; }
    }
  }
});