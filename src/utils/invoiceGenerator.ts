import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Order, formatPriceINR } from '@/types';

export const generateInvoice = (order: Order): Blob => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // Design Tokens
    const margin = 20;
    const accentColor: [number, number, number] = [76, 114, 69]; // Sage Green
    const secondaryColor: [number, number, number] = [40, 40, 40]; // Charcoal
    const mutedColor: [number, number, number] = [120, 120, 120];
    const surfaceColor: [number, number, number] = [248, 250, 248];

    let yPos = 0;

    // 1. Sidebar Accent (Visual Polish)
    doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.rect(0, 0, 5, pageHeight, 'F');

    // 2. Header Section
    yPos = 30;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text('JB Creations', margin, yPos);

    // Modern "INVOICE" Label
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.text('INVOICE', pageWidth - margin, yPos - 5, { align: 'right' });

    // Invoice Meta Data (Top Right)
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
    doc.text(`#${order.id.slice(-6).toUpperCase()}`, pageWidth - margin, yPos, { align: 'right' });

    yPos += 7;
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.text('Handcrafted with Love', margin, yPos);

    // 3. Information Grid (Customer & Order Info)
    yPos += 25;

    // Left Column: Bill To
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.text('BILL TO', margin, yPos);

    yPos += 6;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text(order.customerInfo.name, margin, yPos);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);

    // Multi-line address handling
    const addressLines = [
        order.customerInfo.address,
        `${order.customerInfo.city}, ${order.customerInfo.state} - ${order.customerInfo.pincode}`,
        order.customerInfo.email,
        order.customerInfo.phone
    ];

    addressLines.forEach(line => {
        yPos += 5;
        doc.text(line, margin, yPos);
    });

    // Right Column: Order Details (Aligned to the same yPos as "Bill To")
    let rightY = yPos - (addressLines.length * 5) - 6;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.text('ORDER DETAILS', pageWidth - margin, rightY, { align: 'right' });

    rightY += 6;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, pageWidth - margin, rightY, { align: 'right' });

    rightY += 5;
    const statusColor = order.paymentStatus === 'completed' ? accentColor : [180, 0, 0];
    doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
    doc.text(`Status: ${order.paymentStatus.toUpperCase()}`, pageWidth - margin, rightY, { align: 'right' });

    // 4. Products Table
    yPos = Math.max(yPos, rightY) + 15;

    const tableColumn = ["Item Description", "Qty", "Price", "Total"];
    const tableRows = order.items.map(item => [
        item.product.name,
        item.quantity,
        item.product.displayPrice,
        `${formatPriceINR(item.product.priceInPaise * item.quantity)}`
    ]);

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: yPos,
        theme: 'grid',
        styles: {
            fontSize: 9,
            cellPadding: 5,
            valign: 'middle',
            lineColor: [240, 240, 240],
        },
        headStyles: {
            fillColor: accentColor,
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            halign: 'left'
        },
        columnStyles: {
            0: { cellWidth: 'auto' },
            1: { cellWidth: 20, halign: 'center' },
            2: { cellWidth: 35, halign: 'right' },
            3: { cellWidth: 35, halign: 'right' }
        },
        margin: { left: margin, right: margin }
    });

    // 5. Totals Section
    // @ts-ignore
    let finalY = doc.lastAutoTable.finalY + 10;
    const summaryWidth = 70;
    const summaryX = pageWidth - margin - summaryWidth;

    // Draw a light background for totals
    doc.setFillColor(surfaceColor[0], surfaceColor[1], surfaceColor[2]);
    doc.rect(summaryX, finalY, summaryWidth, 30, 'F');

    const labelX = summaryX + 5;
    const valueX = pageWidth - margin - 5;

    doc.setFontSize(10);
    doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);

    finalY += 8;
    doc.text('Subtotal', labelX, finalY);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text(order.displayTotal, valueX, finalY, { align: 'right' });

    finalY += 7;
    doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
    doc.text('Shipping', labelX, finalY);
    doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.text('FREE', valueX, finalY, { align: 'right' });

    finalY += 8;
    doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.setLineWidth(0.5);
    doc.line(labelX, finalY - 4, valueX, finalY - 4);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text('Total', labelX, finalY);
    doc.text(order.displayTotal, valueX, finalY, { align: 'right' });

    // 6. Footer
    const footerY = pageHeight - 20;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);

    doc.text('Thank you for supporting handcrafted art!', pageWidth / 2, footerY, { align: 'center' });
    doc.text('Questions? Contact us at hello@jbcrafts.com', pageWidth / 2, footerY + 4, { align: 'center' });

    return doc.output('blob');
};

export const downloadInvoice = (order: Order) => {
    const blob = generateInvoice(order);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice_${order.id.slice(-6)}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};