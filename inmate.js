//regular expression to filter out XSFR Token
const XSFR_REGEX = /(?<=\=)(.*?)(?=\;)/;

//this looks to be constant... praying it stays that way
const cookieValue = '.AspNetCore.Antiforgery.9fXoN5jHCXs=CfDJ8Ce9VDaDKHpIptOWN3yolAThzCBrYRqo9xrMZSfLv9CCmAixLynEStAIOIinalmNRW5JfmFAu0Q5JwxiV3uBEwaMiaQ6Oqux3aS1KOf5WhkUrlMxPQB5FHLgvsr4av-3KexgruwTOCgjrQBsKUFqsio';

let XSFR;

let value = 10;
let skipValue = 0;

let partialInmateList = [];
let inmateList = [];

await getAdsData();
partialInmateList = await getInmateData(value, skipValue, true);
processData(partialInmateList);

async function getAdsData() {
    //load ads settings to get XSFR Token
    try {
        const response = await fetch("https://forsythsheriffnc.policetocitizen.com/api/AdsSettings/Version/359", {
            "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "en-US,en;q=0.9",
            //"request-context": "appId=cid-v1:946a5921-f1df-4f45-bfa2-8dd3199a7d80",
            //"request-id": "|63055eccc64c47ff8a5f706b9ed60145.d26f7bfa3c3e4ebf",
            "sec-ch-ua": "\"Chromium\";v=\"130\", \"Google Chrome\";v=\"130\", \"Not?A_Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            //"traceparent": "00-63055eccc64c47ff8a5f706b9ed60145-d26f7bfa3c3e4ebf-01",
            "cookie": cookieValue,
            "Referer": "https://forsythsheriffnc.policetocitizen.com/Inmates/Catalog",
            "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": null,
            "method": "GET"
        });
        
        if (!response.ok) {
            throw new Error(`Ad Settings Response Status: ${response.status}`);
        }
        
        const cookies = response.headers.getSetCookie();
        const XSFRCookie = cookies.find((cookie) => cookie.includes('XSRF-TOKEN'));
        XSFR = XSFR_REGEX.exec(XSFRCookie)[1];
        //console.log(cookies);
    } catch (error) {
        console.error(error.message);
    }
}

async function getInmateData(start, skip, includeCount) {
    //Get inmate list
    try {
        const response = await fetch("https://forsythsheriffnc.policetocitizen.com/api/Inmates/359", {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "en-US,en;q=0.9",
                "content-type": "application/json",
                //"request-context": "appId=cid-v1:946a5921-f1df-4f45-bfa2-8dd3199a7d80",
                //"request-id": "|63055eccc64c47ff8a5f706b9ed60145.a487134d0c8b4bde",
                "sec-ch-ua": "\"Chromium\";v=\"130\", \"Google Chrome\";v=\"130\", \"Not?A_Brand\";v=\"99\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"macOS\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                //"traceparent": "00-63055eccc64c47ff8a5f706b9ed60145-a487134d0c8b4bde-01",
                "x-xsrf-token": XSFR,
                "cookie": cookieValue,
                "Referer": "https://forsythsheriffnc.policetocitizen.com/Inmates/Catalog",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": `{\"FilterOptionsParameters\":{\"IntersectionSearch\":true,\"SearchText\":\"\",\"Parameters\":[]},\"IncludeCount\":true,\"PagingOptions\":{\"SortOptions\":[{\"Name\":\"ArrestDate\",\"SortDirection\":\"Descending\",\"Sequence\":1}],\"Take\":${value},\"Skip\":${skipValue}}}`,
            "method": "POST"
            });
            
            if (!response.ok) {
                throw new Error(`Inamte List Response Status: ${response.status}`);
            }
        
        const json = await response.json();
        console.log(json.Inmates.length);
        console.log(json.Total);
        return json.Inmates;
    } catch (error) {
        console.error(error.message);
    }
}

function processData(partialInmateList) {
    console.log(partialInmateList[0]);
}