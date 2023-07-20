export interface TopicListConfig {
  type: string;

  filters: {
    PageSize?: number;
    PageNumber?: number;
  };
}
