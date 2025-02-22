export async function fetchPatrons() {
  if (!process.env.NEXT_PUBLIC_PATREONS_API_URL) {
    throw new Error(
      "NEXT_PUBLIC_PATREONS_API_URL environment variable is not defined"
    );
  }
  const response = await fetch(process.env.NEXT_PUBLIC_PATREONS_API_URL, {
    headers: {
      Authorization: `Bearer ${process.env.AUTH_PATREON_CREATOR_ACCESS_TOKEN}`,
    },
  });
  const data = await response.json();
  return data;
}

interface PatronAttributes {
  email: string;
  patron_status: null | string;
}

interface PatronProps {
  attributes: PatronAttributes;
  id: string;
  type: string;
}

export async function isActivePatron(email: string) {
  const patrons = await fetchPatrons();
  return patrons.data.some(
    (patron: PatronProps) =>
      patron.attributes.email === email &&
      patron.attributes.patron_status === "active_patron"
  );
}
