import {E_Gone, E_NoRowsAvailable, E_NotFound} from './code'

const Separator = ' - '  // server error message separator

export const NotFoundCodes = new Set([E_NotFound, E_Gone, E_NoRowsAvailable])