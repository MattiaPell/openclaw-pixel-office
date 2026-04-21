// FORGE IMPLEMENTATION PLAN
// Feature: Data Export (CSV/JSON)
// New files: src/utils/exportUtils.ts
// Modified files: src/components/ActivityPage.jsx, src/styles/ActivityPage.css, src/components/TasksPage.jsx, src/styles/TasksPage.css, src/styles/global.css
// Data source: local state / hooks
// Pattern reference: AnalyticsPage.jsx (for data shape awareness)

/**
 * Utilities for exporting data as JSON or CSV.
 */

/**
 * Downloads data as a JSON file.
 * @param {any} data - The data to export.
 * @param {string} filename - The name of the file.
 */
export const downloadJSON = (data: any, filename: string): void => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Flattens nested objects into a single-level object.
 * @param {Record<string, any>} obj - The object to flatten.
 * @param {string} prefix - The prefix for the keys.
 * @returns {Record<string, any>}
 */
const flattenObject = (obj: Record<string, any>, prefix = ''): Record<string, any> => {
  return Object.keys(obj).reduce((acc: Record<string, any>, k: string) => {
    const pre = prefix.length ? prefix + '_' : '';
    if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
      Object.assign(acc, flattenObject(obj[k], pre + k));
    } else if (Array.isArray(obj[k])) {
      acc[pre + k] = obj[k].join('; ');
    } else {
      acc[pre + k] = obj[k];
    }
    return acc;
  }, {});
};

/**
 * Downloads data as a CSV file.
 * @param {Array<Record<string, any>>} data - The data to export.
 * @param {string} filename - The name of the file.
 */
export const downloadCSV = (data: Array<Record<string, any>>, filename: string): void => {
  if (!data || !data.length) return;

  const flattenedData = data.map(item => flattenObject(item));

  // Collect all unique headers across all items
  const headersSet = new Set<string>();
  flattenedData.forEach(item => {
    Object.keys(item).forEach(key => headersSet.add(key));
  });
  const headers = Array.from(headersSet);

  const csvRows: string[] = [];

  // Add headers
  csvRows.push(headers.join(','));

  // Add data rows
  for (const row of flattenedData) {
    const values = headers.map(header => {
      const val = row[header] ?? '';
      let stringVal = '' + val;

      // Prevent CSV Injection: prepend ' if value starts with =, +, -, or @
      if (/^[=+\-@]/.test(stringVal)) {
        stringVal = "'" + stringVal;
      }

      const escaped = stringVal.replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
