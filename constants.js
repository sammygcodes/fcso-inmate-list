// regular expression to filter out XSFR Token
export const XSFR_REGEX = /(?<=\=)(.*?)(?=\;)/;

// this looks to be constant... praying it stays that way
export const COOKIE_VALUE = '.AspNetCore.Antiforgery.9fXoN5jHCXs=CfDJ8Ce9VDaDKHpIptOWN3yolAThzCBrYRqo9xrMZSfLv9CCmAixLynEStAIOIinalmNRW5JfmFAu0Q5JwxiV3uBEwaMiaQ6Oqux3aS1KOf5WhkUrlMxPQB5FHLgvsr4av-3KexgruwTOCgjrQBsKUFqsio';

// amount of inmates to retrieve per API call
export const TAKE_VALUE = 10;