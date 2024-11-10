export interface IGameRequest {
  name: string;
}

export interface IGameResponse {
  id: number;
  name: string;
}

export interface IGameStatsResponse {
  plays: number;
  totalPlayers: number;
  totalStorageMb: number;
  firstPlayed: string;
  lastPlayed: string;
  statsUpdatedDate: string;
}

export interface IOverallStatsResponse {
  playersAmount: number;
  totalMemoryMb: number;
  statsUpdatedDate: string;
}
