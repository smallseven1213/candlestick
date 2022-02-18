/**
 * 依最高最低值判斷線條顏色
 */
export const lineColorParser = (
  open: number,
  close: number
): 'silver' | 'red' | 'green' =>
  open === close ? 'silver' : open > close ? 'red' : 'green'
