export interface GetBookmarkListDto {
  id: number;
  animation: {
    id: number;
    name: string;
    imageUrl: string;
  };
  createdAt: Date;
}
