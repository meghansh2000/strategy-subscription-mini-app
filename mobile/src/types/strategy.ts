export interface Strategy {
  id: number;
  name: string;
  category: string;
  riskLevel: string;
  minCapital: number;
  expectedReturnPct: number;
  isActive?: boolean;
  active?: boolean;
  status?: string;
}
