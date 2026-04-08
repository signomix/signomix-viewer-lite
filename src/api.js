const serverUrl = window.location.origin;

/**
 * Weryfikuje podany klucz aplikacji odpytując API o listę raportów.
 * @param {string} appKey - Klucz aplikacji do weryfikacji.
 * @returns {Promise<Response>} - Odpowiedź z serwera.
 */
export async function checkAppKey(appKey) {
  const url = `${serverUrl}/api/reports/reports`;
  const response = await fetch(url, {
    headers: {
      Authentication: appKey,
    },
  });

  if (!response.ok) {
    throw new Error("Invalid appKey or server error");
  }

  return response;
}

/**
 * Pobiera listę dostępnych pulpitów (dashboardów) dla danego klucza.
 * @param {string} appKey - Autoryzujący klucz aplikacji.
 * @returns {Promise<Array>} - Zwraca listę obiektów dashboardów w formacie JSON.
 */
export async function fetchDashboardsList(appKey) {
  const url = `${serverUrl}/api/core/v2/dashboards`;
  const response = await fetch(url, {
    headers: {
      Authentication: appKey,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch dashboards");
  }

  return await response.json();
}

/**
 * Pobiera gotowy kod HTML wybranego pulpitu (dashboardu).
 * @param {string} did - ID wybranego pulpitu.
 * @param {string} appKey - Autoryzujący klucz aplikacji.
 * @returns {Promise<string>} - Zwraca kod HTML widoku pulpitu.
 */
export async function fetchDashboardHtml(did, appKey) {
  const url = `${serverUrl}/api/reports/page/${encodeURIComponent(did)}?title=false&header=false`;
  const response = await fetch(url, {
    headers: {
      Authentication: appKey,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard HTML");
  }

  return await response.text();
}
