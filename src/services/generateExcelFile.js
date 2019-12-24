// Require library
var xl = require('excel4node');

module.exports = {
  createListKeys: async function (listKeys) {
    // Create a new instance of a Workbook class
    var wb = new xl.Workbook();

    // Add Worksheets to the workbook
    var ws = wb.addWorksheet('Sheet 1');

    // Create a reusable style
    var style = wb.createStyle({
      font: {
        color: '#000000',
        size: 14,
        bold: true,
        width: 15,
        center: true,
        horizontal: 'center'
      }
    });

    ws.column(1).setWidth(12);
    ws.column(2).setWidth(20);

    // Set value of cell A2 to 'string' styled with paramaters of style
    ws.cell(1, 1)
      .string('STT')
      .style(style);

    ws.cell(1, 2)
      .string('Mã')
      .style(style);


    listKeys.forEach((item, index) => {
      ws.cell(index + 1, 1)
        .string(index + "")
        .style(style);

      ws.cell(index + 1, 2)
        .string(item.key)
        .style(style);

    });

    await wb.write('src/app/public/ExcelFile/Excel.xlsx');
  }
}
