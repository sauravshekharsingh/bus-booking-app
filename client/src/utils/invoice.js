import { formatDate } from "./datetime";

export function getInvoiceDefinition(user, booking) {
  return {
    content: [
      {
        columns: [
          [
            {
              text: "Booking Receipt",
              color: "#333333",
              width: "*",
              fontSize: 28,
              bold: true,
              alignment: "right",
              margin: [0, 0, 0, 15],
            },
            {
              stack: [
                {
                  columns: [
                    {
                      text: "Receipt No.",
                      color: "#aaaaab",
                      bold: true,
                      width: "*",
                      fontSize: 12,
                      alignment: "right",
                    },
                    {
                      text: booking._id,
                      bold: true,
                      color: "#333333",
                      fontSize: 12,
                      alignment: "right",
                      width: 180,
                    },
                  ],
                },
                {
                  columns: [
                    {
                      text: "Date Issued",
                      color: "#aaaaab",
                      bold: true,
                      width: "*",
                      fontSize: 12,
                      alignment: "right",
                    },
                    {
                      text: new Date(booking.date).toLocaleDateString("en-US"),
                      bold: true,
                      color: "#333333",
                      fontSize: 12,
                      alignment: "right",
                      width: 180,
                    },
                  ],
                },
                {
                  columns: [
                    {
                      text: "Status",
                      color: "#aaaaab",
                      bold: true,
                      fontSize: 12,
                      alignment: "right",
                      width: "*",
                    },
                    {
                      text: booking.cancelled === true ? "CANCELLED" : "BOOKED",
                      bold: true,
                      fontSize: 14,
                      alignment: "right",
                      color: booking.cancelled === true ? "red" : "green",
                      width: 180,
                    },
                  ],
                },
              ],
            },
          ],
        ],
      },
      {
        columns: [
          {
            text: "From",
            color: "#aaaaab",
            bold: true,
            fontSize: 14,
            alignment: "left",
            margin: [0, 20, 0, 5],
          },
          {
            text: "To",
            color: "#aaaaab",
            bold: true,
            fontSize: 14,
            alignment: "left",
            margin: [0, 20, 0, 5],
          },
        ],
      },
      {
        columns: [
          {
            text: "Bus Booking App",
            bold: true,
            color: "#333333",
            alignment: "left",
          },
          {
            text: user.name,
            bold: true,
            color: "#333333",
            alignment: "left",
          },
        ],
      },
      "\n\n",
      {
        width: "100%",
        alignment: "center",
        text: `Invoice No. ${booking._id}`,
        bold: true,
        margin: [0, 10, 0, 10],
        fontSize: 15,
      },
      {
        layout: {
          defaultBorder: false,
          hLineWidth: function (i, node) {
            return 1;
          },
          vLineWidth: function (i, node) {
            return 1;
          },
          hLineColor: function (i, node) {
            if (i === 1 || i === 0) {
              return "#bfdde8";
            }
            return "#eaeaea";
          },
          vLineColor: function (i, node) {
            return "#eaeaea";
          },
          hLineStyle: function (i, node) {
            return null;
          },
          paddingLeft: function (i, node) {
            return 10;
          },
          paddingRight: function (i, node) {
            return 10;
          },
          paddingTop: function (i, node) {
            return 2;
          },
          paddingBottom: function (i, node) {
            return 2;
          },
          fillColor: function (rowIndex, node, columnIndex) {
            return "#fff";
          },
        },
        table: {
          headerRows: 1,
          widths: ["*", 80],
          body: [
            [
              {
                text: "Description",
                fillColor: "#eaf2f5",
                border: [false, true, false, true],
                margin: [0, 5, 0, 5],
                textTransform: "uppercase",
              },
              {
                text: "Amount",
                border: [false, true, false, true],
                alignment: "right",
                fillColor: "#eaf2f5",
                margin: [0, 5, 0, 5],
                textTransform: "uppercase",
              },
            ],
            [
              {
                text: `${booking.from} to ${booking.to} on ${formatDate(
                  booking.date
                )} ( x ${booking.seatNumbers.length} seats )`,
                border: [false, false, false, true],
                margin: [0, 5, 0, 5],
                alignment: "left",
              },
              {
                border: [false, false, false, true],
                text: `INR ${booking.fare}`,
                fillColor: "#f5f5f5",
                alignment: "right",
                margin: [0, 5, 0, 5],
              },
            ],
          ],
        },
      },
      "\n",
      "\n\n",
      {
        layout: {
          defaultBorder: false,
          hLineWidth: function (i, node) {
            return 1;
          },
          vLineWidth: function (i, node) {
            return 1;
          },
          hLineColor: function (i, node) {
            return "#eaeaea";
          },
          vLineColor: function (i, node) {
            return "#eaeaea";
          },
          hLineStyle: function (i, node) {
            // if (i === 0 || i === node.table.body.length) {
            return null;
            //}
          },
          // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
          paddingLeft: function (i, node) {
            return 10;
          },
          paddingRight: function (i, node) {
            return 10;
          },
          paddingTop: function (i, node) {
            return 3;
          },
          paddingBottom: function (i, node) {
            return 3;
          },
          fillColor: function (rowIndex, node, columnIndex) {
            return "#fff";
          },
        },
        table: {
          headerRows: 1,
          widths: ["*", "auto"],
          body: [
            [
              {
                text: "Payment Subtotal",
                border: [false, true, false, true],
                alignment: "right",
                margin: [0, 5, 0, 5],
              },
              {
                border: [false, true, false, true],
                text: `INR ${booking.fare}`,
                alignment: "right",
                fillColor: "#f5f5f5",
                margin: [0, 5, 0, 5],
              },
            ],
            [
              {
                text: "Payment Processing Fee",
                border: [false, false, false, true],
                alignment: "right",
                margin: [0, 5, 0, 5],
              },
              {
                text: "INR 0",
                border: [false, false, false, true],
                fillColor: "#f5f5f5",
                alignment: "right",
                margin: [0, 5, 0, 5],
              },
            ],
            [
              {
                text: "Total Amount",
                bold: true,
                fontSize: 20,
                alignment: "right",
                border: [false, false, false, true],
                margin: [0, 5, 0, 5],
              },
              {
                text: `INR ${booking.fare}`,
                bold: true,
                fontSize: 20,
                alignment: "right",
                border: [false, false, false, true],
                fillColor: "#f5f5f5",
                margin: [0, 5, 0, 5],
              },
            ],
          ],
        },
      },
      "\n\n",
      {
        text: "Thanks for booking with us. Have a good day.",
        style: "notesText",
      },
    ],
    styles: {
      notesTitle: {
        fontSize: 10,
        bold: true,
        margin: [0, 50, 0, 3],
      },
      notesText: {
        fontSize: 10,
      },
    },
    defaultStyle: {
      columnGap: 20,
    },
  };
}
