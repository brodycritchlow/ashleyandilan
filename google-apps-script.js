const UT_SHEET_NAME = 'Ceremony List (UT)';
const IL_SHEET_NAME = 'Ceremony List (IL)';

function doGet(e) {
  const action = e.parameter.action;
  const wedding = e.parameter.wedding || 'UT';

  if (action === 'search') {
    const query = e.parameter.query || '';
    return searchGuests(query, wedding);
  }

  if (action === 'getGroup') {
    const groupId = e.parameter.groupId;
    return getGroupMembers(groupId, wedding);
  }

  return createJsonResponse({ error: 'Invalid action' });
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    return submitRSVP(data);
  } catch (error) {
    return createJsonResponse({ error: error.message });
  }
}

function searchGuests(query, wedding) {
  if (!query || query.length < 2) {
    return createJsonResponse({ results: [] });
  }

  const sheetName = wedding === 'IL' ? IL_SHEET_NAME : UT_SHEET_NAME;
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();

  const results = [];
  const queryLower = query.toLowerCase().trim();

  for (let i = 2; i < data.length; i++) {
    const name = data[i][0];
    if (!name) continue;

    const nameLower = name.toString().toLowerCase();
    const similarity = calculateSimilarity(queryLower, nameLower);

    if (nameLower.includes(queryLower) || similarity > 0.6) {
      results.push({
        name: name,
        groupId: data[i][1],
        plusOne: data[i][2] === true || data[i][2] === 'TRUE',
        row: i + 1,
        score: nameLower.includes(queryLower) ? 1 : similarity
      });
    }
  }

  results.sort((a, b) => b.score - a.score);

  return createJsonResponse({ results: results.slice(0, 10) });
}

function getGroupMembers(groupId, wedding) {
  if (groupId === undefined || groupId === null || groupId === '') {
    return createJsonResponse({ error: 'Group ID required' });
  }

  const sheetName = wedding === 'IL' ? IL_SHEET_NAME : UT_SHEET_NAME;
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();

  const members = [];
  const groupIdStr = String(groupId);

  for (let i = 2; i < data.length; i++) {
    const memberGroupId = data[i][1];
    if (memberGroupId !== undefined && memberGroupId !== null && memberGroupId !== '' && String(memberGroupId) === groupIdStr) {
      members.push({
        name: data[i][0],
        groupId: memberGroupId,
        plusOne: data[i][2] === true || data[i][2] === 'TRUE',
        row: i + 1,
        rsvpStatus: data[i][3] || null,
        hasResponded: !!data[i][3]
      });
    }
  }

  return createJsonResponse({ members: members });
}

function submitRSVP(data) {
  const wedding = data.wedding || 'UT';
  const sheetName = wedding === 'IL' ? IL_SHEET_NAME : UT_SHEET_NAME;
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);

  const responses = data.responses || [];
  const timestamp = new Date().toISOString();

  responses.forEach(response => {
    const row = response.row;
    if (!row) return;

    sheet.getRange(row, 4).setValue(response.attending ? 'Yes' : 'No');

    if (response.attending) {
      sheet.getRange(row, 5).setValue(response.meal || '');
      sheet.getRange(row, 6).setValue(response.dietary ? response.dietary.join(', ') : '');
      sheet.getRange(row, 7).setValue(response.dietaryNotes || '');

      if (response.plusOneName) {
        sheet.getRange(row, 8).setValue(response.plusOneName);
        sheet.getRange(row, 9).setValue(response.plusOneMeal || '');
        sheet.getRange(row, 10).setValue(response.plusOneDietary ? response.plusOneDietary.join(', ') : '');
        sheet.getRange(row, 11).setValue(response.plusOneDietaryNotes || '');
      }
    }

    sheet.getRange(row, 12).setValue(timestamp);
  });

  return createJsonResponse({
    success: true,
    message: 'RSVP submitted successfully!',
    count: responses.length
  });
}

function calculateSimilarity(str1, str2) {
  const len1 = str1.length;
  const len2 = str2.length;

  if (len1 === 0) return len2 === 0 ? 1 : 0;
  if (len2 === 0) return 0;

  const matrix = [];

  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  const distance = matrix[len1][len2];
  const maxLen = Math.max(len1, len2);
  return 1 - (distance / maxLen);
}

function createJsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
