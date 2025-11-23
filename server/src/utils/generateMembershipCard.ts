// utils/generateMembershipCard.ts

import QRCode from "qrcode";
import pdfMake from "pdfmake/build/pdfmake.js";
import pdfFonts from "pdfmake/build/vfs_fonts.js";
import dotenv from "dotenv";
dotenv.config();

pdfMake.vfs = (pdfFonts as any).pdfMake?.vfs || {};

export const generateMembershipCard = async (member: any): Promise<Buffer> => {
  const memberCode = member.memberCode;

  const qrDataUrl = await QRCode.toDataURL(memberCode, {
    width: 250,
    margin: 2,
  });

  const docDefinition: any = {
    pageSize: { width: 380, height: 400 },
    pageMargins: [20, 20, 20, 20],
    background: {
      canvas: [
        { type: "rect", x: 0, y: 0, w: 380, h: 400, color: "#1e293b" }, // card background
        { type: "rect", x: 0, y: 0, w: 380, h: 60, color: "#0f172a" }, // header bar
      ],
    },
    content: [
      { text: "BROTHERS GYM", style: "gymName", alignment: "center" },
      "\n\n",
      {
        text: member.fullName.toUpperCase(),
        style: "name",
        alignment: "center",
      },
      { text: `Phone: ${member.phone}`, style: "info", alignment: "center" },
      "\n\n",
      { image: qrDataUrl, width: 200, alignment: "center" },
    ],
    styles: {
      gymName: { fontSize: 28, bold: true, color: "#10b981" },
      name: {
        fontSize: 24,
        bold: true,
        color: "#ffffff",
        margin: [0, 10, 0, 2],
      },
      info: { fontSize: 18, color: "#e2e8f0", margin: [0, 2, 0, 2] },
      qrText: { fontSize: 14, color: "#94a3b8", margin: [0, 5] },
    },
  };

  return new Promise<Buffer>((resolve, reject) => {
    const pdf = pdfMake.createPdf(docDefinition);
    pdf.getBuffer((buffer: Uint8Array | Buffer) => {
      try {
        resolve(Buffer.from(buffer as Uint8Array));
      } catch (err) {
        reject(err);
      }
    });
  });
};
