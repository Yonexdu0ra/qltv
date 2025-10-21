function formatVND(value) {
  if (value === null || value === undefined || value === "") return "";

  // Ép thành số
  const number = Number(value);

  // Nếu không phải số hợp lệ
  if (isNaN(number)) return value;

  // Tách phần nguyên và phần thập phân
  const [integer, decimal] = number.toString().split(".");

  // Format phần nguyên: thêm dấu chấm phân tách nghìn
  const formattedInt = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // Nếu có phần thập phân và khác 00 thì thêm vào
  if (decimal && parseInt(decimal) !== 0) {
    return `${formattedInt},${decimal}`;
  }

  return formattedInt;
}
module.exports = formatVND;