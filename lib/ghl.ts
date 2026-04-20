export interface GHLLeadData {
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
  custom?: Record<string, string>;
}

export async function createGHLLead(
  data: GHLLeadData,
  tags: string[] = []
): Promise<{ id: string; success: boolean } | null> {
  const apiKey = process.env.GHL_API_KEY;
  if (!apiKey) return null;

  try {
    const [firstName, ...nameParts] = data.firstName.split(' ');
    const lastName = nameParts.join(' ') || data.lastName || 'User';

    const payload = {
      firstName: firstName || 'Lead',
      lastName,
      email: data.email,
      phone: data.phone,
      tags: [...tags, 'seo-audit'],
      customFields: data.custom || {},
    };

    const url = 'https://api.gohighlevel.com/v1/contacts/';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error('GHL error:', await response.text());
      return null;
    }

    const result = await response.json();
    return { id: result.id || result.contactId, success: true };
  } catch (error) {
    console.error('GHL lead creation error:', error);
    return null;
  }
}

export async function sendGHLEmail(
  email: string,
  subject: string,
  htmlBody: string
): Promise<boolean> {
  const apiKey = process.env.GHL_API_KEY;
  if (!apiKey) return false;

  try {
    const url = 'https://api.gohighlevel.com/v1/emails/send';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: email,
        subject,
        htmlBody,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('GHL email error:', error);
    return false;
  }
}
