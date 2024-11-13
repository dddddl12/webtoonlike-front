import puppeteer from "puppeteer";
import { InvoiceContentT } from "@/resources/invoices/invoice.types";
import { getTranslations } from "next-intl/server";

export async function convertHtmlToPdfBuffer(html: string) {
  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });

  const page = await browser.newPage();

  await page.setContent(html);

  const result = await page.pdf({
    format: "A4",
    width: "2480px",
    height: "3508px",
    printBackground: true
  });

  await browser.close();

  return result;
}

export async function convertInvoiceToHtml(content: InvoiceContentT) {
  const locale = "ko";
  const [tCountries, tBusinessFields, tContractType] = await Promise.all([
    getTranslations({ locale, namespace: "countries" }),
    getTranslations({ locale, namespace: "businessFields" }),
    getTranslations({ locale, namespace: "contractType" }),
  ]);

  const { webtoon, bidRequest, buyer, creator, issuedAt } = content;
  const { contractRange } = bidRequest;
  const validUntil = new Date(issuedAt);
  validUntil.setFullYear(issuedAt.getFullYear() + 1);

  const html = `<html lang=${locale}>
    <style>
      body {
        padding: 16px;
        font-size: 14px;
      }
      h1 {
        font-size: 26px;
      }
      table { width: 100%; border-collapse: collapse; font-size: 14px;}
      th, td { border: 2px solid black; padding: 16px; text-align: center; }

      .subtitle {
        font-size: 22px;
        font-weight: bold;
      }
      .box {
        border: 2px solid black;
        padding: 20px;
      }
      .bold {
        font-weight: bold;
      }
      .text-center {
        text-align: center;
      }
    </style>
    <body>
      <h1 class="text-center">협의 내역서</h1>
      <p class="subtitle">구매자</p>
      <div class="box">
        <p>회사명: ${buyer.name}</p>
        <p>담당자명: ${buyer.user.name}</p>
        <p>주소: ${buyer.user.addressLine1} ${buyer.user.addressLine2}</p>
        <p>연락처: ${buyer.user.phone}</p>
        <p>사업자번호: ${buyer.businessNumber}</p>
      </div>

      <div style="height: 40px"></div>

      <p class="subtitle">판매자</p>
      <div class="box">
        <p>작가명: ${creator.name}</p>
        <p>연락처: ${creator.user.phone}</p>
        <p>주소: ${creator.user.addressLine1} ${creator.user.addressLine2}</p>
        <p>작품명: ${webtoon?.title}</p>
      </div>

      <div style="height: 40px"></div>

      <p class="subtitle">조건</p>

      <table>
        <thead class="bold">
          <tr>
            <th>서비스 권역</th>
            <th>사업권</th>
            <th>독점 권리</th>
            <th>합의 조건</th>
          </tr>
        </thead>
        <tbody>
          ${contractRange.map((item) => {
            return (
              `
      <tr>
        <td>${tCountries(item.country)}</td>
        <td>${tBusinessFields(item.businessField)}</td>
        <td>${tContractType(item.contract)}</td>
        <td>${item.message}</td>
      </tr>
      `
            );
          })}
      </tbody>
      </table>

      <p class="text-center">협의 내역서 만료 기간: ${validUntil.toLocaleString(locale, {
        timeZone: "Asia/Seoul",
        year: "numeric",
        month: "long",
        day: "numeric",
      })}</p>

      <p class="bold subtitle text-center">위 협의 사항을 웹툰라이크가 보증합니다. </p>

      <p class="text-center">${issuedAt.toLocaleString(locale, {
        timeZone: "Asia/Seoul",
        year: "numeric",
        month: "long",
        day: "numeric",
      })}</p>

    </body>
  </html>`;
  return html.replace(/\n/g, "").replace(/\s{2,}/g, " ");
}
