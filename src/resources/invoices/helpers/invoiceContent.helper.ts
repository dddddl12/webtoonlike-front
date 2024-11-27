import "server-only";
import { getTranslations } from "next-intl/server";
import { InvoiceContentT } from "@/resources/invoices/dtos/invoiceContent.dto";

export async function convertInvoiceToHtml(content: InvoiceContentT) {
  const locale = "ko";
  const [tCountries, tBusinessFields, tContractType] = await Promise.all([
    getTranslations({ locale, namespace: "countries" }),
    getTranslations({ locale, namespace: "businessFields" }),
    getTranslations({ locale, namespace: "contractType" }),
  ]);

  const { webtoon, offerProposal, buyer, creator, issuedAt } = content;
  const { contractRange } = offerProposal;
  const validUntil = new Date(issuedAt);
  validUntil.setFullYear(issuedAt.getFullYear() + 1);

  const html = `<html lang=${locale}>
    <head>
      <title>인보이스</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Nanum+Gothic&display=swap" rel="stylesheet">
      <style>
        body {
          padding: 16px;
          font-size: 14px;
          color: black;
          font-family: "Nanum Gothic", sans-serif;
          font-weight: 400;
          font-style: normal;
        }
        h1 {
          font-size: 26px;
          font-weight: bold;
        }
        .table {
          font-size: 14px;
          display: grid;
          border: 1px solid black;
          grid-template-columns: 1fr 1fr 1fr 2fr;
          padding: 0;
        }
        .header {
          font-weight: bold;
        }
        .row {
          padding: 0;
          display: contents; /* Treat each row as a part of the grid */
        }
        .cell {
          border: 1px solid black;
          padding: 0 8px;
          display: flex;
          align-items: center;
        }
        .cell p {
          text-align: center;
        }
        .cell.left-align p {
          text-align: left;
        }
  
        .subtitle {
          font-size: 22px;
          font-weight: bold;
          margin-top: 40px;
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
    </head>
    <body>
      <h1 class="text-center">협의 내역서</h1>
      <p class="subtitle">구매자</p>
      <div class="box">
        <p>회사명: ${buyer.name || "-"}</p>
        <p>담당자명: ${buyer.user.name || "-"}</p>
        <p>주소: ${[buyer.user.addressLine1, buyer.user.addressLine2].join(" ") || "-"}</p>
        <p>연락처: ${buyer.user.phone || "-"}</p>
        <p>사업자번호: ${buyer.businessNumber || "-"}</p>
      </div>

      <p class="subtitle">판매자</p>
      <div class="box">
        <p>작가명: ${creator.name || "-"}</p>
        <p>연락처: ${creator.user.phone || "-"}</p>
        <p>주소: ${[creator.user.addressLine1, creator.user.addressLine2].join(" ") || "-"}</p>
        <p>작품명: ${webtoon.title || "-"}</p>
      </div>

      <p class="subtitle">조건</p>

      <div class="table">
        <div class="row header">
          <div class="cell">
            <p>서비스 권역</p>
          </div>
          <div class="cell">
            <p>사업권</p>
          </div>
          <div class="cell">
            <p>독점 권리</p>
          </div>
          <div class="cell">
            <p>합의 조건</p>
          </div>
        </div>
          ${contractRange.map((item) => {
            return (
              `
      <div class="row">
        <div class="cell">
          <p>${tCountries(item.country) || "-"}</p>
        </div>
        <div class="cell">
          <p>${tBusinessFields(item.businessField) || "-"}</p>
        </div>
        <div class="cell">
          <p>${tContractType(item.contract) || "-"}</p>
        </div>
        <div class="cell left-align">
          <p>${item.message || "-"}</p>
        </div>
      </div>
      `
            );
          }).join("")}
      </div>

      <p class="text-center">협의 내역서 만료 기간: ${validUntil.toLocaleString(locale, {
        timeZone: "Asia/Seoul",
        dateStyle: "long",
      })}</p>

      <p class="bold subtitle text-center">위 협의 사항을 Kipstock이 보증합니다. </p>

      <p class="text-center">${issuedAt.toLocaleString(locale, {
        timeZone: "Asia/Seoul",
        dateStyle: "long",
      })}</p>

    </body>
  </html>`;
  return html.replace(/\n/g, "").replace(/\s{2,}/g, " ");
}
