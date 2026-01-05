export interface Session {
  id: number;
  topic: string;
  location: string;
  time: string;
  status: string;
  coach_id?: number;
  coachee_id?: number;
}
