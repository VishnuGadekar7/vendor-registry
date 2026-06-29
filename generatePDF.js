const puppeteer = require('puppeteer');

async function generatePDF(data) {
  let browser = null;
  try {
    const launchOptions = {
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--single-process',
        '--disable-extensions',
        '--disable-background-networking',
        '--disable-default-apps',
        '--disable-translate',
        '--no-first-run'
      ]
    };

    if (process.env.PUPPETEER_EXECUTABLE_PATH) {
      launchOptions.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
    }

    browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();

    const v = (field) => data[field] || '';

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        @page {
          size: A4 portrait;
          margin: 12mm 14mm 18mm 14mm;
        }

        body {
          font-family: 'Inter', Helvetica, Arial, sans-serif;
          font-size: 11px;
          color: #1a1a1a;
          line-height: 1.35;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .header, .footer {
          text-align: center;
          padding: 10px 0 6px;
        }

        .header h1 {
          font-size: 16px;
          font-weight: 700;
          letter-spacing: 0.5px;
          margin-bottom: 3px;
        }

        .header p, .footer p {
          font-size: 9.5px;
          color: #333;
          margin: 1px 0;
        }

        .form-title {
          text-align: center;
          font-size: 14px;
          font-weight: 700;
          margin: 10px 0 8px;
          text-decoration: underline;
          letter-spacing: 0.3px;
        }

        table.main {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 0;
        }

        table.main td, table.main th {
          border: 1px solid #000;
          padding: 5px 8px;
          vertical-align: top;
          font-size: 10.5px;
        }

        .section-heading {
          background-color: #e0e0e0 !important;
          font-weight: 700;
          text-align: left;
          font-size: 11px;
          padding: 6px 8px;
          letter-spacing: 0.2px;
        }

        .label-cell {
          font-weight: 700;
          background-color: #f5f5f5 !important;
          width: 40%;
        }

        .value-cell {
          background-color: #ffffff !important;
          width: 60%;
          min-height: 18px;
        }

        .hint {
          font-size: 8.5px;
          color: #666;
          font-weight: 400;
          display: block;
          margin-top: 1px;
        }

        .policy-text {
          padding: 6px 10px;
          font-size: 10px;
          line-height: 1.45;
          text-align: justify;
        }

        .terms-list {
          padding: 6px 10px 6px 24px;
          font-size: 10px;
          line-height: 1.45;
        }

        .terms-list li {
          margin-bottom: 3px;
          text-align: justify;
        }

        .note-text {
          font-size: 9px;
          font-style: italic;
          padding: 4px 10px 6px;
          color: #333;
        }

        .declaration-text {
          padding: 6px 10px;
          font-size: 10px;
          line-height: 1.45;
          text-align: justify;
        }

        .sig-table {
          width: 100%;
          border-collapse: collapse;
        }

        .sig-table td {
          border: 1px solid #000;
          padding: 8px 10px;
          vertical-align: top;
          font-size: 10.5px;
          width: 50%;
        }

        .sig-line {
          border-bottom: 1px solid #000;
          display: inline-block;
          min-width: 180px;
          padding-bottom: 1px;
          margin-left: 4px;
        }

        .stamp-box {
          width: 120px;
          height: 60px;
          border: 1px dashed #999;
          margin-top: 6px;
        }

        .footer {
          margin-top: 8px;
          border-top: 1px solid #ccc;
          padding-top: 6px;
        }

        .footer h3 {
          font-size: 11px;
          font-weight: 700;
          margin-bottom: 2px;
        }
      </style>
    </head>
    <body>

      <!-- COMPANY HEADER -->
      <div class="header">
        <h1>ENERGIZE PHARMACEUTICALS (P) LIMITED</h1>
        <p>Regd. Office: 24, 2nd Floor, B-Tower, City Vista Downtown, EON IT Park Road, Kharadi, Pune-411014</p>
        <p>E-Mail: account@energizepharma.com &nbsp;|&nbsp; Contact Number: 085-3061-4555</p>
      </div>

      <div class="form-title">VENDOR REGISTRATION FORM</div>

      <table class="main">

        <!-- SECTION 1: VENDOR DETAILS -->
        <tr><td colspan="2" class="section-heading">VENDOR DETAILS</td></tr>
        <tr>
          <td class="label-cell">VENDOR NAME</td>
          <td class="value-cell">${esc(v('vendorName'))}</td>
        </tr>
        <tr>
          <td class="label-cell">VENDOR TYPE<span class="hint">(MANUFACTURER / DISTRIBUTOR / AGENT / OTHER / CFT / C&amp;A)</span></td>
          <td class="value-cell">${esc(v('vendorType'))}</td>
        </tr>
        <tr>
          <td class="label-cell">VENDOR COMPOSITION<span class="hint">(Co. / Partnership / Firm)</span></td>
          <td class="value-cell">${esc(v('vendorComposition'))}</td>
        </tr>
        <tr>
          <td class="label-cell">CIN (if Company)</td>
          <td class="value-cell">${esc(v('cin'))}</td>
        </tr>
        <tr>
          <td class="label-cell">MSME REG NO.<span class="hint">(To Enclose Reg Copy if registered)</span></td>
          <td class="value-cell">${esc(v('msmeRegNo'))}</td>
        </tr>
        <tr>
          <td class="label-cell">CONTACT ADDRESS</td>
          <td class="value-cell">${esc(v('contactAddress'))}</td>
        </tr>
        <tr>
          <td class="label-cell">CITY &amp; STATE</td>
          <td class="value-cell">${esc(v('cityAndState'))}</td>
        </tr>
        <tr>
          <td class="label-cell">E-MAIL ID<span class="hint">(Payments &amp; P.O Advice will be shared in this mail ID)</span></td>
          <td class="value-cell">${esc(v('emailId'))}</td>
        </tr>
        <tr>
          <td class="label-cell">MOBILE NO</td>
          <td class="value-cell">${esc(v('mobileNo'))}</td>
        </tr>
        <tr>
          <td class="label-cell">CREDIT PERIOD IN DAYS</td>
          <td class="value-cell">${esc(v('creditPeriodDays'))}</td>
        </tr>

        <!-- SECTION 2: TAX DETAILS -->
        <tr><td colspan="2" class="section-heading">TAX DETAILS</td></tr>
        <tr>
          <td class="label-cell">GSTIN<span class="hint">(To Enclose GST Reg Copy)</span></td>
          <td class="value-cell">${esc(v('gstin'))}</td>
        </tr>
        <tr>
          <td class="label-cell">PERMANENT ACCOUNT NO (PAN)</td>
          <td class="value-cell">${esc(v('pan'))}</td>
        </tr>
        <tr>
          <td class="label-cell">DRUG LICENSE NO<span class="hint">(if Drug or Cosmetics Products)</span></td>
          <td class="value-cell">${esc(v('drugLicenceNo'))}</td>
        </tr>
        <tr>
          <td class="label-cell">FOOD LICENSE NO<span class="hint">(if registered under FSSAI for Nutraceuticals Products)</span></td>
          <td class="value-cell">${esc(v('foodLicenceNo'))}</td>
        </tr>

        <!-- SECTION 3: BANK ACCOUNT DETAILS -->
        <tr><td colspan="2" class="section-heading">BANK ACCOUNT DETAILS</td></tr>
        <tr>
          <td class="label-cell">BANK NAME</td>
          <td class="value-cell">${esc(v('bankName'))}</td>
        </tr>
        <tr>
          <td class="label-cell">BANK ACCOUNT NO<span class="hint">(To Enclose Cancelled Cheque Copy)</span></td>
          <td class="value-cell">${esc(v('bankAccountNo'))}</td>
        </tr>
        <tr>
          <td class="label-cell">IFSC CODE</td>
          <td class="value-cell">${esc(v('ifscCode'))}</td>
        </tr>

        <!-- SECTION 4: STOCK RETURN POLICY -->
        <tr><td colspan="2" class="section-heading">STOCK RETURN POLICY</td></tr>
        <tr>
          <td colspan="2" class="policy-text">
            All Claims towards breakage/damage/Expiry/Non Moving Stock will be Settled within 90 days from the date of Invoice/Return Note
          </td>
        </tr>

        <!-- SECTION 5: GST COMPLIANCE POLICY -->
        <tr><td colspan="2" class="section-heading">GST COMPLIANCE POLICY</td></tr>
        <tr>
          <td colspan="2" class="policy-text">
            In case there is a mismatch of input tax credit, non-payment of GST or non-filing of GST returns by Vendor, due to which Energize is not able to avail input tax credit on the GST paid on the consideration, then Vendor agrees that Energize shall have the right to setoff any such amounts from any amounts that subsequently become due and payable to Vendor from the Vendor for which the input credit on the GST could not be availed by Energize
          </td>
        </tr>

        <!-- SECTION 6: GENERAL TERMS AND CONDITIONS -->
        <tr><td colspan="2" class="section-heading">GENERAL TERM AND CONDITIONS</td></tr>
        <tr>
          <td colspan="2">
            <ol class="terms-list">
              <li>Vendor has to comply all statutory compliances and inform to Energize Pharmaceuticals Pvt Ltd in case of any changes/exceptions.</li>
              <li>Terms of trade should not be shared to any other third party.</li>
              <li>Any Liability arising out of erroneous details provided by the Vendor is to be borne by the Vendor</li>
              <li>Vendor registration if done shall be valid for 2 years and thereafter supplier has to renew the same</li>
            </ol>
            <div class="note-text">*While submitting the vendor registration form, ensure to enclose your documents.</div>
          </td>
        </tr>

        <!-- SECTION 7: DECLARATION -->
        <tr><td colspan="2" class="section-heading">DECLARATION</td></tr>
        <tr>
          <td colspan="2" class="declaration-text">
            I hereby declare that the above information is true and correct to the best of my knowledge and belief and I further state that I shall be liable for any action(s) that may be taken by the company in respect of any discrepancies/falsehood in the information given by me.
          </td>
        </tr>
      </table>

      <!-- SIGNATURE ROW -->
      <table class="sig-table">
        <tr>
          <td>
            <div style="margin-bottom:6px;">Name: <span class="sig-line">${esc(v('declarantName'))}</span></div>
            <div style="margin-bottom:6px;">Designation: <span class="sig-line">${esc(v('designation'))}</span></div>
            <div>Date: <span class="sig-line">${esc(v('declarationDate'))}</span></div>
          </td>
          <td style="text-align:center;">
            <div style="font-weight:700; margin-bottom:4px;">Authorised Signatory</div>
            <div style="font-size:9px; color:#555; margin-bottom:6px;">(Company Seal/Stamp)</div>
            <div class="stamp-box"></div>
          </td>
        </tr>
      </table>

      <!-- COMPANY FOOTER -->
      <div class="footer">
        <h3>ENERGIZE PHARMACEUTICALS (P) LIMITED</h3>
        <p>Regd. Office: 24, 2nd Floor, B-Tower, City Vista Downtown, EON IT Park Road, Kharadi, Pune-411014</p>
        <p>E-Mail: account@energizepharma.com &nbsp;|&nbsp; Contact Number: 085-3061-4555</p>
      </div>

    </body>
    </html>
    `;

    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '12mm',
        right: '14mm',
        bottom: '18mm',
        left: '14mm'
      }
    });

    console.log('✅ PDF generated, size:', pdfBuffer.length, 'bytes');
    return Buffer.from(pdfBuffer);
  } catch (err) {
    console.error('❌ PDF generation failed:', err.message);
    throw err;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

module.exports = generatePDF;
