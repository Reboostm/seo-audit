import { NextRequest, NextResponse } from 'next/server';
import { createLead, updateLead } from '@/lib/firebase';
import { generateReport } from '@/lib/generateReport';
import { createGHLLead, sendGHLEmail } from '@/lib/ghl';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const required = ['businessName', 'email', 'phone', 'niche', 'city', 'state'];

    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing: ${field}` },
          { status: 400 }
        );
      }
    }

    // Create lead in Firestore
    const leadDoc = await createLead({
      businessName: body.businessName,
      email: body.email,
      phone: body.phone,
      niche: body.niche,
      city: body.city,
      state: body.state,
      zip: body.zip || '',
      customJobCost: body.customJobCost || null,
      status: 'processing',
    });

    const leadId = leadDoc.id;

    // Generate report asynchronously (fire and forget)
    generateReportAsync(leadId, body, body.email).catch(err =>
      console.error('Async report generation failed:', err)
    );

    return NextResponse.json(
      {
        success: true,
        leadId,
        message: 'Form received. Your report will be emailed within 2 minutes.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Form error:', error);
    return NextResponse.json(
      { error: 'Form submission failed' },
      { status: 500 }
    );
  }
}

// Async report generation
async function generateReportAsync(leadId: string, formData: any, email: string) {
  try {
    const reportResult = await generateReport({
      businessName: formData.businessName,
      niche: formData.niche,
      city: formData.city,
      state: formData.state,
      email,
      customJobCost: formData.customJobCost,
    });

    if (!reportResult.success) {
      await updateLead(leadId, { status: 'failed', error: reportResult.error });
      return;
    }

    // Create lead in GHL
    const ghlResult = await createGHLLead(
      {
        firstName: formData.businessName.split(' ')[0] || 'Lead',
        lastName: formData.businessName,
        email,
        phone: formData.phone,
        custom: {
          niche: formData.niche,
          city: formData.city,
          state: formData.state,
          mapPackRank: String(reportResult.reportData?.mapPackRank || 99),
          gmbScore: String(reportResult.reportData?.gmbScore || 0),
          lostRevenue: String(reportResult.reportData?.lostRevenueMonthly || 0),
        },
      },
      ['seo-audit', formData.niche]
    );

    // Send email via GHL
    await sendGHLEmail(email, reportResult.emailSubject!, reportResult.emailBody!);

    // Update lead status
    await updateLead(leadId, {
      status: 'completed',
      ghlLeadId: ghlResult?.id,
      reportData: reportResult.reportData,
    });
  } catch (error) {
    console.error('Async report generation failed:', error);
    await updateLead(leadId, {
      status: 'failed',
      error: String(error),
    });
  }
}
