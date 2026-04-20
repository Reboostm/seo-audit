export interface ReportData {
  businessName: string;
  niche: string;
  city: string;
  state: string;
  mapPackRank: number;
  gmbScore: number;
  gmbReviewCount: number;
  gmbRating: number;
  gmbPhotoCount: number;
  websiteSpeed: number;
  competitors: Array<{ name: string; rank: number; rating: number; reviews: number }>;
  lostRevenueMonthly: number;
  actionItems: Array<{ title: string; status: string }>;
}

export function generateHTMLReport(data: ReportData): string {
  const actionItemsHTML = data.actionItems
    .map(
      (item) =>
        `<li style="margin-bottom: 10px; padding: 10px; background: #f5f5f5; border-left: 4px solid ${item.status === 'missing' ? '#dc2626' : '#f59e0b'};">
          <strong>${item.title}</strong> <span style="color: #999; font-size: 12px;">${item.status}</span>
        </li>`
    )
    .join('');

  const competitorsHTML = data.competitors
    .map(
      (c) =>
        `<tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">#${c.rank} ${c.name}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${c.rating} ⭐</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${c.reviews} reviews</td>
        </tr>`
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .header { background: linear-gradient(135deg, #0066cc, #0052a3); color: white; padding: 40px; text-align: center; margin-bottom: 30px; }
    .section { margin: 30px 0; padding: 20px; background: #f9f9f9; border-left: 4px solid #0066cc; }
    .metric { display: inline-block; margin: 10px 20px 10px 0; }
    .metric-value { font-size: 32px; font-weight: bold; color: #0066cc; }
    .metric-label { font-size: 12px; color: #999; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .warning { background: #fef3c7; padding: 20px; border-left: 4px solid #f59e0b; margin: 20px 0; }
    .action-list { list-style: none; padding: 0; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #999; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🎯 SEO Audit Report</h1>
    <p><strong>${data.businessName}</strong> | ${data.city}, ${data.state}</p>
  </div>

  <div style="padding: 20px;">
    <h2>📊 Quick Summary</h2>
    <div>
      <div class="metric">
        <div class="metric-value">#${data.mapPackRank === 99 ? 'N/A' : data.mapPackRank}</div>
        <div class="metric-label">Map Pack Rank</div>
      </div>
      <div class="metric">
        <div class="metric-value">${data.gmbScore}%</div>
        <div class="metric-label">GMB Score</div>
      </div>
      <div class="metric">
        <div class="metric-value">${data.websiteSpeed}%</div>
        <div class="metric-label">Website Speed</div>
      </div>
      <div class="metric">
        <div class="metric-value">$${data.lostRevenueMonthly.toLocaleString()}</div>
        <div class="metric-label">Lost/Month</div>
      </div>
    </div>

    <div class="warning">
      <strong>⚠️ Lost Revenue Alert</strong><br>
      You're potentially losing <strong>$${data.lostRevenueMonthly.toLocaleString()}/month</strong> in revenue due to your current ranking position. Moving to #1-3 could recapture 70-80% of this lost revenue.
    </div>

    <div class="section">
      <h3>🏢 Your Google My Business Profile</h3>
      <p><strong>Rating:</strong> ${data.gmbRating} ⭐ (${data.gmbReviewCount} reviews)</p>
      <p><strong>Photos:</strong> ${data.gmbPhotoCount}</p>
      <p><strong>Profile Completeness:</strong> ${data.gmbScore}%</p>
    </div>

    <div class="section">
      <h3>🗺️ Competition Analysis</h3>
      <table>
        <thead>
          <tr style="background: #f0f0f0;">
            <th style="padding: 10px; text-align: left;">Business</th>
            <th style="padding: 10px; text-align: center;">Rating</th>
            <th style="padding: 10px; text-align: center;">Reviews</th>
          </tr>
        </thead>
        <tbody>
          ${competitorsHTML}
        </tbody>
      </table>
    </div>

    <div class="section">
      <h3>✅ Action Items to Improve Ranking</h3>
      <ul class="action-list">
        ${actionItemsHTML}
      </ul>
    </div>

    <div class="section">
      <h2>🚀 Next Steps</h2>
      <p>To improve your rankings and recapture lost revenue:</p>
      <ol>
        <li><strong>Add More Photos to GMB:</strong> Aim for 30+ high-quality photos</li>
        <li><strong>Get More Reviews:</strong> Implement a systematic review request process</li>
        <li><strong>Optimize Profile:</strong> Complete all fields, add services, business hours, and Q&A</li>
        <li><strong>Post Regularly:</strong> Update GMB with posts and offers 2-3 times per week</li>
        <li><strong>Improve Website Speed:</strong> Optimize images, cache, and implement a CDN</li>
      </ol>
    </div>

    <div class="footer">
      <p>Generated by ReBoost SEO Audit | ${new Date().toLocaleDateString()}</p>
      <p>Questions? Reply to this email or call us for a strategy session.</p>
    </div>
  </div>
</body>
</html>
  `;
}
