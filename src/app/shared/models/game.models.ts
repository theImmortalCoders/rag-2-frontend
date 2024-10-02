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
}
