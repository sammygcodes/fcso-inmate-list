import * as readline from 'node:readline';
import { stdin as input, stdout as output } from 'node:process';
import { COOKIE_VALUE, TAKE_VALUE, XSFR_REGEX } from './constants.js'

import * as XLSX from 'xlsx/xlsx.mjs';
import * as fs from 'fs';
XLSX.set_fs(fs);

const rl = readline.createInterface({ input, output });

// value needed for API call to work
let XSFR;

let totalInmates = -1;
let maxBond = 0;

let skipValue = 0;

let inmateList = [];
let filteredList = [];

rl.setPrompt('What is the maximum bond amount? (no comma separator): ');
rl.prompt();

rl.on('line', async function(amount) {
    if(amount > 0) {
        maxBond = amount;
        console.log('Getting list...');
        await getInmates();
        exportList();
        rl.close();
    } else {
        console.log('Invalid amount. Try again.');
        rl.prompt();
    }
}).on('close', function() {
    process.exit(0);
});

async function getInmates() {
    // get XSFR value from Ads Settings Call
    await getAdsData();

    // retrieve all inmates (API only retrieves 10 at a time on browser)
    do {
        let partialInmateList = await getInmateData(TAKE_VALUE, skipValue, !skipValue);
        addInmates(partialInmateList);
        skipValue += TAKE_VALUE;
    } while (skipValue < totalInmates);

    processList(maxBond);
}

function addInmates(partialInmateList) {
    partialInmateList.forEach((inmate) => {
        inmateList.push(inmate);
    });
    //console.log(inmateList.length + ' inmates in list');
    console.log(`${inmateList.length}/${totalInmates} inmates retrieved`)
}

function processList(bondAmount) {
    inmateList.forEach((inmate) => {
        if(inmate.TotalBondAmount <= bondAmount && inmate.TotalBondAmount > 0) {
            filteredList.push(inmate);
        }
    });
    console.log(`There are ${filteredList.length} inmates with a total bond amount under $${maxBond}`);
}

function exportList() {
    console.log('Exporting list...');
    let csvList = [];
    filteredList.forEach((inmate) => {
        csvList.push({
            firstName: inmate.FirstName,
            lastName: inmate.LastName,
            totalBondAmount: inmate.TotalBondAmount,
            arrestDate: inmate.ArrestDate,
            releaseDate: inmate.ReleaseDate,
            courtDate: inmate.CourtDate
        });
    });

    const sheet = XLSX.utils.json_to_sheet(csvList);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, "Inmates");
    XLSX.writeFile(workbook, 'inmates.xlsx');
}

async function getAdsData() {
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
            "cookie": COOKIE_VALUE,
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
                "cookie": COOKIE_VALUE,
                "Referer": "https://forsythsheriffnc.policetocitizen.com/Inmates/Catalog",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": `{\"FilterOptionsParameters\":{\"IntersectionSearch\":true,\"SearchText\":\"\",\"Parameters\":[]},\"IncludeCount\":${includeCount},\"PagingOptions\":{\"SortOptions\":[{\"Name\":\"ArrestDate\",\"SortDirection\":\"Descending\",\"Sequence\":1}],\"Take\":${TAKE_VALUE},\"Skip\":${skipValue}}}`,
            "method": "POST"
            });
            
            if (!response.ok) {
                throw new Error(`Inamte List Response Status: ${response.status}`);
            }
        
        const json = await response.json();
        //console.log(json.Inmates.length);
        if(includeCount) {
            totalInmates = json.Total;
        }
        // console.log('total: ' + json.Total);
        return json.Inmates;
    } catch (error) {
        console.error(error.message);
    }
}