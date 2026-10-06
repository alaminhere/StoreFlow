/* eslint-disable @typescript-eslint/no-explicit-any */
import { InvoiceData } from '@/types/invoice.types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import formatDate from '../formatDate';

const COLORS = {
  primary: '#DBA254',
  text: '#172033',
  muted: '#6B7280',
  border: '#E5E7EB',
  light: '#FAF7F2',
  white: '#FFFFFF',
  due: '#DC2626',
};

const formatPrice = (value: number) =>
  `Tk ${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

export default formatPrice;

export const createInvoicePDF = (invoice: InvoiceData) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 12;

  // store Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(COLORS.text);
  doc.text(invoice.store.name, margin, 16);
  if (invoice.store.tagline) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(COLORS.muted);

    doc.text(invoice.store.tagline, margin, 21);
  }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(COLORS.primary);

  doc.text('INVOICE', pageWidth - margin, 16, {
    align: 'right',
  });


  // invoice number
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(COLORS.muted);

  doc.text(invoice.invoiceNo, pageWidth - margin, 21, {
    align: 'right',
  });

  // header line
  doc.setDrawColor(COLORS.primary);
  doc.setLineWidth(0.6);

  doc.line(margin, 27, pageWidth - margin, 27);

  // from
  const infoY = 35;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(COLORS.primary);
  doc.text('FROM', margin, infoY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(COLORS.text);
  doc.text(invoice.store.name, margin, infoY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(COLORS.muted);

  let storeY = infoY + 11;

  if (invoice.store.phone) {
    doc.text(invoice.store.phone, margin, storeY);

    storeY += 4;
  }

  if (invoice.store.email) {
    doc.text(invoice.store.email, margin, storeY);
  }

  //supplier / customer
  const partyX = pageWidth / 2 + 8;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(COLORS.primary);

  doc.text(
    invoice.partyType === 'supplier' ? 'SUPPLIER' : 'CUSTOMER',
    partyX,
    infoY,
  );

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(COLORS.text);

  doc.text(invoice.party.name, partyX, infoY + 6);

  let partyY = infoY + 11;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(COLORS.muted);

  if (invoice.party.businessName) {
    doc.text(invoice.party.businessName, partyX, partyY);

    partyY += 4;
  }

  if (invoice.party.phone) {
    doc.text(invoice.party.phone, partyX, partyY);
    partyY += 4;
  }

  if (invoice.party.email) {
    doc.text(invoice.party.email, partyX, partyY);
  }

  //meta
  const metaY = 58;
  doc.setFillColor(COLORS.light);
  doc.roundedRect(margin, metaY, pageWidth - margin * 2, 15, 2, 2, 'F');

  // date
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(COLORS.muted);
  doc.text('INVOICE DATE', margin + 4, metaY + 5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(COLORS.text);

  doc.text(formatDate(invoice.issueDate), margin + 4, metaY + 11);

  // payment Method
  const paymentX = 82;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(COLORS.muted);
  doc.text('PAYMENT METHOD', paymentX, metaY + 5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(COLORS.text);
  doc.text(invoice.paymentMethod || 'N/A', paymentX, metaY + 11);

  // Status
  const statusX = pageWidth - margin - 38;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(COLORS.muted);
  doc.text('STATUS', statusX, metaY + 5);

  const statusLabel =
    invoice.status === 'paid'
      ? 'PAID'
      : invoice.status === 'partial'
        ? 'PARTIAL'
        : 'DUE';

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(invoice.status === 'due' ? COLORS.due : COLORS.primary);
  doc.text(statusLabel, statusX, metaY + 11);

  // item

  autoTable(doc, {
    startY: metaY + 21,

    margin: {
      left: margin,
      right: margin,
      bottom: 20,
    },

    head: [['ITEM', 'QTY', 'UNIT PRICE', 'TOTAL']],

    body: invoice.items.map(item => [
      item.name,
      item.qty.toString(),
      formatPrice(item.price),
      formatPrice(item.total),
    ]),

    theme: 'grid',

    styles: {
      font: 'helvetica',
      fontSize: 7.5,

      // কম gap
      cellPadding: {
        top: 2.5,
        bottom: 2.5,
        left: 3,
        right: 3,
      },

      textColor: COLORS.text,
      lineColor: COLORS.border,
      lineWidth: 0.15,

      valign: 'middle',
    },

    headStyles: {
      fillColor: COLORS.primary,
      textColor: COLORS.white,

      fontSize: 7.5,
      fontStyle: 'bold',

      cellPadding: {
        top: 3,
        bottom: 3,
        left: 3,
        right: 3,
      },

      halign: 'center',
    },

    bodyStyles: {
      fontSize: 7.5,
    },

    alternateRowStyles: {
      fillColor: '#FCFCFC',
    },

    columnStyles: {
      0: {
        cellWidth: 'auto',
      },

      1: {
        cellWidth: 18,
        halign: 'center',
      },

      2: {
        cellWidth: 34,
        halign: 'right',
      },

      3: {
        cellWidth: 36,
        halign: 'right',
      },
    },

    didParseCell: data => {
      if (data.section === 'head') {
        data.cell.styles.fontStyle = 'bold';
      }
    },
  });

  // subtotal
  const finalY = (doc as any).lastAutoTable.finalY;
  const totalsTop = finalY + 7;
  const labelX = pageWidth - margin - 58;
  const valueX = pageWidth - margin;

  // subtotal
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(COLORS.muted);
  doc.text('Subtotal', labelX, totalsTop);
  doc.setTextColor(COLORS.text);
  doc.text(formatPrice(invoice.subtotal), valueX, totalsTop, {
    align: 'right',
  });

  // discount
  doc.setTextColor(COLORS.muted);
  doc.text('Discount', labelX, totalsTop + 6);
  doc.setTextColor(COLORS.text);
  doc.text(`- ${formatPrice(invoice.discount)}`, valueX, totalsTop + 6, {
    align: 'right',
  });

  // total box
  doc.setFillColor(COLORS.light);
  doc.roundedRect(labelX - 4, totalsTop + 10, 62, 10, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(COLORS.text);
  doc.text('TOTAL', labelX, totalsTop + 17);

  doc.text(formatPrice(invoice.grandTotal), valueX, totalsTop + 17, {
    align: 'right',
  });

  // Paid
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(COLORS.muted);
  doc.text('Paid', labelX, totalsTop + 25);
  doc.setTextColor(COLORS.primary);
  doc.text(formatPrice(invoice.paidAmount), valueX, totalsTop + 25, {
    align: 'right',
  });

  // due
  doc.setTextColor(COLORS.muted);
  doc.text('Amount Due', labelX, totalsTop + 31);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(invoice.dueAmount > 0 ? COLORS.due : COLORS.primary);
  doc.text(formatPrice(invoice.dueAmount), valueX, totalsTop + 31, {
    align: 'right',
  });

  //footer
  doc.setDrawColor(COLORS.border);
  doc.setLineWidth(0.2);
  doc.line(margin, pageHeight - 18, pageWidth - margin, pageHeight - 18);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(COLORS.muted);
  doc.text('Thank you for your business.', margin, pageHeight - 11);
  doc.setTextColor(COLORS.primary);
  doc.text(invoice.store.name, pageWidth - margin, pageHeight - 11, {
    align: 'right',
  });

  return doc;
};

export const generateInvoicePDF = (invoice: InvoiceData) => {
  createInvoicePDF(invoice).save(`${invoice.invoiceNo}.pdf`);
};

export const getInvoicePDFBlob = (invoice: InvoiceData): Blob =>
  createInvoicePDF(invoice).output('blob');
