export interface IVaccineRegistration {
  id: number;
  userId: number;
  groupId: number;
  siteId?: number;
  vaccineId?: number;
  code: string;
  insurranceCard: string;
  job: string;
  workPlace: string;
  address: string;
  time: Date;
  shift: number;
  status: number;
  createdAt: Date;
  updatedAt: Date;
}
