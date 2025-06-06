// regular expression to filter out XSFR Token
export const XSFR_REGEX = /(?<=\=)(.*?)(?=\;)/;

// beginning of antiforgery cookie value
export const COOKIE_VALUE = '.AspNetCore.Antiforgery.cdV5uW_Ejgc';

// amount of inmates to retrieve per API call
export const TAKE_VALUE = 10;