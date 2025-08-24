import jsPDF from 'jspdf';
import { SubOrderResponse } from '@/types';

export const generateSimplePickingList = (orders: SubOrderResponse[]) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.width;
  const pageHeight = pdf.internal.pageSize.height;
  const margin = 20;
  let yPosition = 30;
  let itemNumber = 1;

  // Title
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('PHIEU LAY HANG', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 10;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Ngay: ${new Date().toLocaleDateString('vi-VN')}`, pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 20;

  // Simple table header
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.setFillColor(240, 240, 240);
  pdf.rect(margin, yPosition, pageWidth - (margin * 2), 12, 'F');
  
  pdf.text('STT', margin + 5, yPosition + 8);
  pdf.text('Ten san pham', margin + 25, yPosition + 8);
  pdf.text('So luong', margin + 130, yPosition + 8);
  pdf.text('Tick', margin + 160, yPosition + 8);
  
  yPosition += 12;

  // Collect all items from all orders
  const allItems: Array<{ name: string; quantity: number; orderId: number }> = [];
  
  orders.forEach(order => {
    order.orderItems.forEach(item => {
      allItems.push({
        name: item.productVariant.productName,
        quantity: item.quantity,
        orderId: order.subOrderId
      });
    });
  });

  // Group items by product name and sum quantities
  const groupedItems = allItems.reduce((acc, item) => {
    if (acc[item.name]) {
      acc[item.name].quantity += item.quantity;
      acc[item.name].orders.push(item.orderId);
    } else {
      acc[item.name] = {
        quantity: item.quantity,
        orders: [item.orderId]
      };
    }
    return acc;
  }, {} as Record<string, { quantity: number; orders: number[] }>);

  // Render items
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  
  Object.entries(groupedItems).forEach(([productName, data]) => {
    // Check if we need a new page
    if (yPosition > pageHeight - 40) {
      pdf.addPage();
      yPosition = 30;
      
      // Repeat header on new page
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.setFillColor(240, 240, 240);
      pdf.rect(margin, yPosition, pageWidth - (margin * 2), 12, 'F');
      
      pdf.text('STT', margin + 5, yPosition + 8);
      pdf.text('Ten san pham', margin + 25, yPosition + 8);
      pdf.text('So luong', margin + 130, yPosition + 8);
      pdf.text('Tick', margin + 160, yPosition + 8);
      
      yPosition += 12;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
    }

    // Draw row background (alternating)
    if (itemNumber % 2 === 0) {
      pdf.setFillColor(250, 250, 250);
      pdf.rect(margin, yPosition, pageWidth - (margin * 2), 12, 'F');
    }

    // Item number
    pdf.text(itemNumber.toString(), margin + 5, yPosition + 8);
    
    // Product name (truncate if too long)
    const maxNameLength = 45;
    const displayName = productName.length > maxNameLength 
      ? productName.substring(0, maxNameLength) + '...' 
      : productName;
    pdf.text(displayName, margin + 25, yPosition + 8);
    
    // Quantity
    pdf.text(data.quantity.toString(), margin + 135, yPosition + 8);
    
    // Checkbox for ticking
    pdf.setDrawColor(0, 0, 0);
    pdf.rect(margin + 160, yPosition + 2, 8, 8);
    
    yPosition += 12;
    itemNumber++;
  });

  // Add summary
  yPosition += 10;
  pdf.setFont('helvetica', 'bold');
  pdf.text(`Tong cong: ${itemNumber - 1} loai san pham`, margin, yPosition);
  yPosition += 8;
  const totalQuantity = Object.values(groupedItems).reduce((sum, item) => sum + item.quantity, 0);
  pdf.text(`Tong so luong: ${totalQuantity} san pham`, margin, yPosition);

  // Signature area
  yPosition += 30;
  pdf.text('Nguoi lay hang:', margin, yPosition);
  pdf.text('_________________________', margin + 50, yPosition);
  yPosition += 15;
  pdf.text('Ngay/Gio:', margin, yPosition);
  pdf.text('_________________________', margin + 50, yPosition);

  return pdf;
};

export const generateWarehousePDF = (orders: SubOrderResponse[]) => {
  // Use the simple picking list instead
  return generateSimplePickingList(orders);
};

export const exportWarehouseOrdersPDF = (orders: SubOrderResponse[], filename?: string) => {
  const pdf = generateWarehousePDF(orders);
  const defaultFilename = `phieu-lay-hang-kho-${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(filename || defaultFilename);
};

export const exportSingleOrderPDF = (order: SubOrderResponse) => {
  const pdf = generateWarehousePDF([order]);
  const filename = `phieu-lay-hang-${order.subOrderId}-${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(filename);
};
