import 'dotenv/config';
import { OrderBy } from '../enums/common.enum';

export const constants = {
  DATE_FORMAT: 'YYYY-MM-DD',
  DATE_FORMAT_V2: 'DD MMM YYYY',
  DATE_TIME_FORMAT: 'YYYY-MM-DD HH:mm:ss',
  TIME_FORMAT: 'HH:mm:ss',
  HOUR_FORMAT: 'h:mm A',
  PAGINATION: {
    PAGE_DEFAULT: 1,
    LIMIT_DEFAULT: 10,
    SORT_BY_DEFAULT: 'id',
    ORDER_BY_DEFAULT: OrderBy.DESC,
  },
  ACCESS_TOKEN: {
    EXPIRES_IN: '30d',
  },
  REFRESH_TOKEN: {
    EXPIRES_IN: '30d',
    TLL: 2592000, // 30 days
  },
  ROUNDED_NUMBER: 2,
};
