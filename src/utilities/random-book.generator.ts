import { CONSTANTS } from './../constants/constants';
const book = function randomBookGenerator(): string { return String(Math.floor(Math.random() * 1e10) % CONSTANTS.GUTENBERG_BOOK_COUNT); }
export default book; 