import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export async function exportMultiPagePDF(
  element: HTMLElement,
  filename = "export.pdf"
) {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    allowTaint: true,

    onclone(doc) {
      doc.querySelectorAll("*").forEach((node) => {
        const el = node as HTMLElement; // safe cast
        const cs = doc.defaultView?.getComputedStyle(el);
        if (!cs) return;

        const props = [
          "color",
          "backgroundColor",
          "borderColor",
          "outlineColor",
          "textDecorationColor",
          "columnRuleColor",
          "boxShadow",
        ];

        props.forEach((prop) => {
          const value = cs[prop as any];

          if (value && typeof value === "string" && value.includes("lab(")) {
            if (prop === "backgroundColor") {
              el.style[prop as any] = "#ffffff";
            } else {
              el.style[prop as any] = "#000000";
            }
          }
        });
      });
    },
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imgProps = (pdf as any).getImageProperties(imgData);
  const imgWidth = pageWidth;
  const imgHeight = (imgProps.height * pageWidth) / imgProps.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(filename);
}



export function exportCSV(
  data: {
    weekKey: string;
    pie: { labels: string[]; values: number[] };
    bar: { labels: string[]; values: number[] };
  },
  filename = "export.csv"
) {
  const { weekKey, pie, bar } = data;
  const rows: string[] = [];

  rows.push(`Week: ${weekKey}`);
  rows.push("");
  rows.push("Category,Value");

  pie.labels.forEach((l, i) => rows.push(`${l},${pie.values[i] ?? 0}`));

  rows.push("");
  rows.push("Day,Value");

  bar.labels.forEach((l, i) => rows.push(`${l},${bar.values[i] ?? 0}`));

  const blob = new Blob([rows.join("\n")], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
