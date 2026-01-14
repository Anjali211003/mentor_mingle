// session-request.model.ts
export interface SessionRequest {
  id: number;
  coach_id: number;
  coachee_id: number;
  message: string;
  status: string;
  created_at: string;
}
